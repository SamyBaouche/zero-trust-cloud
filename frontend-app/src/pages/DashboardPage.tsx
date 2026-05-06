import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getCurrentContext, getCurrentUserProfile } from '../services/contextService'
import DecisionBadge from '../components/dashboard/DecisionBadge'
import LogsTable from '../components/dashboard/LogsTable'
import { useAuth } from '../context/AuthContext'
import { submitAccessCheck } from '../services/accessService'
import { fetchLogs } from '../services/logService'
import { fetchPolicies } from '../services/policyService'
import type { AccessCheckRequest, AccessCheckResponse, AccessLog } from '../types/access'
import type { Policy } from '../types/policy'
import type { UserProfile } from '../types/auth'

/**
 * DashboardPage is the main authenticated screen.
 * <p>
 * It combines multiple backend features in one place:
 * - user profile (/context/profile)
 * - access decision engine (/access/check)
 * - audit logs (/logs)
 * - security alerts (/alerts)
 * - active policies (/policies)
 */

/**
 * Static resource options used by the Access Check form.
 * These labels mirror common cloud targets used in the demo.
 */
const CLOUD_RESOURCES = [
  'PUBLIC_DOCS',
  'INTERNAL_API',
  'AWS_S3_FINANCE_BUCKET',
  'AWS_EC2_PRODUCTION_SERVER',
  'AWS_RDS_CUSTOMER_DATABASE',
  'AWS_IAM_ADMIN_ROLE',
  'KUBERNETES_CLUSTER',
  'SECRETS_MANAGER',
]
/**
 * Static action options used by the Access Check form.
 */
const CLOUD_ACTIONS = [
  'READ',
  'WRITE',
  'DELETE',
  'DEPLOY',
  'ASSUME_ROLE',
  'DOWNLOAD_SECRET',
]

/**
 * Initial form values so the access form is always controlled.
 */
const defaultPayload: AccessCheckRequest = {
  resource: 's3://finance-reports',
  action: 'read',
  ipAddress: '192.168.1.8',
  location: 'Paris, FR',
  device: 'Managed laptop',
}

export default function DashboardPage() {
  const { userEmail } = useAuth()

  // Access-check form and latest decision state.
  const [formData, setFormData] = useState<AccessCheckRequest>(defaultPayload)
  const [latestDecision, setLatestDecision] = useState<AccessCheckResponse | null>(null)
  const [requestLoading, setRequestLoading] = useState(false)

  // Logs panel state.
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [logs, setLogs] = useState<AccessLog[]>([])

  // Policies and client-side filters.
  const [policies, setPolicies] = useState<Policy[]>([])
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL')
  const [policySearch, setPolicySearch] = useState('')
  const [policyDecisionFilter, setPolicyDecisionFilter] = useState('ALL')

  // User profile panel state.
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Normalize email once so all comparisons are case-insensitive.
  const normalizedUserEmail = userEmail?.trim().toLowerCase() ?? null

  /** Reloads logs from the backend and filters them for the current user. */
  const refreshLogs = async () => {
    if (!normalizedUserEmail) {
      setLogs([])
      setLogsError(null)
      return
    }

    setLogsLoading(true)
    setLogsError(null)

    try {
      const data = await fetchLogs()
      setLogs(
        data.filter((log) => (log.userEmail ?? '').trim().toLowerCase() === normalizedUserEmail),
      )
    } catch {
      setLogsError('Logs endpoint unavailable. Verify backend route /logs (or /access/logs).')
      setLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  /** Reloads the profile information for the authenticated user. */
  const refreshProfile = async () => {
    try {
      const data = await getCurrentUserProfile()
      setProfile(data)
      setProfileError(null)
    } catch {
      setProfile(null)
      setProfileError('Profile data unavailable. Restart backend to enable /context/profile.')
    }
  }

  /**
   * Load policy catalog once on first render.
   * Policies are global rules, not tied to a specific user session.
   */
  useEffect(() => {
    fetchPolicies().then(setPolicies).catch(() => setPolicies([]))
  }, [])

  // We intentionally refresh user-related panels only when the authenticated user changes.
  // The helper functions are defined inline in this component and are not memoized.
  useEffect(() => {
    // When auth state changes, refresh all user-tied panels.
    if (!userEmail) {
      setLogs([])
      setLatestDecision(null)
      setLogsError(null)
      setProfile(null)
      setProfileError(null)
      return
    }
    void refreshLogs()
    void refreshProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  /**
   * Compute top-level log counters displayed in Security Overview.
   */
  const stats = useMemo(() => {
    const base = { total: logs.length, allow: 0, challenge: 0, deny: 0 }

    for (const log of logs) {
      const decision = log.decision.toUpperCase()
      if (decision === 'ALLOW') base.allow += 1
      if (decision === 'CHALLENGE') base.challenge += 1
      if (decision === 'DENY') base.deny += 1
    }

    return base
  }, [logs])

  /**
   * Build a short, newest-first activity feed for quick visibility.
   */
  const recentActivity = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
  }, [logs])

  /**
   * Apply risk filter to logs.
   * If backend does not provide riskScore, we infer a fallback score from decision.
   */
  const filteredRiskLogs = useMemo(() => {
    const resolveRiskScore = (log: AccessLog) => {
      if (typeof log.riskScore === 'number') return log.riskScore
      if (log.decision.toUpperCase() === 'DENY') return 85
      if (log.decision.toUpperCase() === 'CHALLENGE') return 60
      return 25
    }

    return [...logs]
      .filter((log) => {
        const risk = resolveRiskScore(log)
        if (riskFilter === 'ALL') return true
        if (riskFilter === 'HIGH') return risk >= 80
        if (riskFilter === 'MEDIUM') return risk >= 50 && risk < 80
        return risk < 50
      })
      .sort((a, b) => resolveRiskScore(b) - resolveRiskScore(a))
  }, [logs, riskFilter])

  /**
   * Aggregate filtered risk logs by resource to highlight hot targets.
   */
  const topRiskResources = useMemo(() => {
    const counts = new Map<string, number>()
    for (const log of filteredRiskLogs) {
      counts.set(log.resource, (counts.get(log.resource) ?? 0) + 1)
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [filteredRiskLogs])

  /**
   * Apply decision filter + text search over active policies.
   */
  const filteredPolicies = useMemo(() => {
    const query = policySearch.trim().toLowerCase()

    return policies.filter((policy) => {
      const matchesDecision =
        policyDecisionFilter === 'ALL' || policy.decision.toUpperCase() === policyDecisionFilter.toUpperCase()

      const matchesSearch =
        !query ||
        policy.resource.toLowerCase().includes(query) ||
        policy.action.toLowerCase().includes(query) ||
        (policy.condition ?? '').toLowerCase().includes(query)

      return matchesDecision && matchesSearch
    })
  }, [policies, policySearch, policyDecisionFilter])

  /** Returns a display-safe value for optional profile fields. */
  const displayValue = (value?: string | null) => (value && value.trim() ? value : '-')

  /** Formats an optional date string using browser locale, with safe fallback. */
  const displayDate = (value?: string | null) => {
    if (!value) {
      return '-'
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
  }

  // Derived profile labels for avatar and heading.
  const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
  const avatarLabel = profileName
    ? profileName
        .split(' ')
        .map((chunk) => chunk[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ZT'

  /**
   * Submit access check request and refresh logs so the new event appears immediately.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestLoading(true)

    try {
      // Call the access engine.
      const response = await submitAccessCheck(formData)
      setLatestDecision(response)
      // Refresh logs so the new decision appears in the audit table.
      await refreshLogs()
    } catch {
      setLatestDecision({
        decision: 'DENY',
        riskScore: 100,
        message: 'Request denied or service unavailable.',
      })
    } finally {
      setRequestLoading(false)
    }
  }

  /**
   * Prefill context fields (IP/device/location) using backend and browser context.
   */
  const handleUseCurrentContext = async () => {
    try {
      // Ask the backend for our "real" IP + device info.
      const context = await getCurrentContext()
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setFormData((prev) => ({
        ...prev,
        ipAddress: context.ipAddress,
        device: context.device || navigator.userAgent,
        // We use the browser time zone as an approximate location label.
        location: timezone || 'Unknown',
      }))
    } catch (error) {
      console.error('Failed to detect current context', error)
    }
  }

  return (
    <div className="dashboard-grid">
      <section className="glass-card panel">
        <div className="panel-heading">
          <h2>User Profile</h2>
          <button type="button" className="ghost-button" onClick={() => void refreshProfile()}>
            Refresh profile
          </button>
        </div>
        <div className="profile-row">
          <span className="avatar">{avatarLabel}</span>
          <div>
            <p>{profileName || userEmail || 'Unknown user'}</p>
            <p className="muted">{displayValue(profile?.email || userEmail)}</p>
            <p className="muted">Session: {new Date().toLocaleString()}</p>
          </div>
        </div>
        <div className="profile-details">
          {profileError && <p className="error-text">{profileError}</p>}
          <p>
            <span className="profile-label">Date of birth:</span> {displayDate(profile?.dateOfBirth)}
          </p>
          <p>
            <span className="profile-label">Company:</span> {displayValue(profile?.company)}
          </p>
          <p>
            <span className="profile-label">Job title:</span> {displayValue(profile?.jobTitle)}
          </p>
          <p>
            <span className="profile-label">Country:</span> {displayValue(profile?.country)}
          </p>
          <p>
            <span className="profile-label">Phone:</span> {displayValue(profile?.phone)}
          </p>
          <p>
            <span className="profile-label">Department:</span> {displayValue(profile?.department)}
          </p>
          <p>
            <span className="profile-label">Clearance:</span> {displayValue(profile?.securityClearance)}
          </p>
        </div>
      </section>

      <section className="glass-card panel">
        <h2>Security Overview</h2>
        <div className="metrics-grid">
          <article>
            <strong>{stats.total}</strong>
            <span>Total logs</span>
          </article>
          <article>
            <strong>{stats.allow}</strong>
            <span>ALLOW</span>
          </article>
          <article>
            <strong>{stats.challenge}</strong>
            <span>CHALLENGE</span>
          </article>
          <article>
            <strong>{stats.deny}</strong>
            <span>DENY</span>
          </article>
        </div>

        <div className="activity-list">
          <h3>Recent activity</h3>
          {recentActivity.length ? (
            recentActivity.map((item, index) => (
              <article className="activity-item" key={`${item.createdAt}-${index}`}>
                <DecisionBadge decision={item.decision} />
                <p>
                  {item.action} on {item.resource}
                </p>
                <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
              </article>
            ))
          ) : (
            <p className="muted">No recent activity.</p>
          )}
        </div>
      </section>

      <section className="glass-card panel panel-wide">
        <h2>Access Check Engine</h2>
        <form className="access-form" onSubmit={handleSubmit}>
          <select
            value={formData.resource}
            onChange={(e) => setFormData((prev) => ({ ...prev, resource: e.target.value }))}
            required
          >
            <option value="">Select resource</option>
            {CLOUD_RESOURCES.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <select
            value={formData.action}
            onChange={(e) => setFormData((prev) => ({ ...prev, action: e.target.value }))}
            required
          >
            <option value="">Select action</option>
            {CLOUD_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            value={formData.ipAddress}
            onChange={(event) => setFormData((prev) => ({ ...prev, ipAddress: event.target.value }))}
            placeholder="ipAddress"
            required
          />
          <input
            value={formData.location}
            onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="location"
            required
          />
          <input
            value={formData.device}
            onChange={(event) => setFormData((prev) => ({ ...prev, device: event.target.value }))}
            placeholder="device"
            required
          />
          <button className="primary-button" type="submit" disabled={requestLoading}>
            {requestLoading ? 'Analyzing...' : 'Check access'}
          </button>
          <button type="button" className="use-context-btn" onClick={handleUseCurrentContext}>
            Use my current context
          </button>
        </form>

        {latestDecision && (
          <div className="decision-card">
            <DecisionBadge decision={latestDecision.decision} />
            <p>Risk Score: {latestDecision.riskScore}</p>
            <p className="muted">{latestDecision.message}</p>
            {Array.isArray(latestDecision.reasons) && latestDecision.reasons.length > 0 && (
              <ul className="risk-breakdown">
                {latestDecision.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="glass-card panel panel-wide">
        <div className="panel-heading">
          <h2>Recent Access Logs</h2>
          <button type="button" className="ghost-button" onClick={() => void refreshLogs()}>
            Refresh
          </button>
        </div>
        {logsError && <p className="error-text">{logsError}</p>}
        <LogsTable logs={logs.slice(0, 6)} loading={logsLoading} compact />
      </section>

      <section className="glass-card panel">
        <h2>Risk Insights</h2>
        <div className="settings-actions">
          <button type="button" className="ghost-button" onClick={() => setRiskFilter('ALL')}>
            All
          </button>
          <button type="button" className="ghost-button" onClick={() => setRiskFilter('HIGH')}>
            High risk
          </button>
          <button type="button" className="ghost-button" onClick={() => setRiskFilter('MEDIUM')}>
            Medium risk
          </button>
          <button type="button" className="ghost-button" onClick={() => setRiskFilter('LOW')}>
            Low risk
          </button>
        </div>
        {filteredRiskLogs.length === 0 && <p className="muted">No risky activity for this filter.</p>}
        <div className="alerts-list">
          {filteredRiskLogs.slice(0, 6).map((log, index) => (
            <article key={`${log.createdAt}-${index}`} className={`alert-card alert-${log.decision.toLowerCase()}`}>
              <strong>{log.decision} decision</strong>
              <span>
                {log.action} on {log.resource}
              </span>
              <div className="muted" style={{ fontSize: '0.95em' }}>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </article>
          ))}
        </div>
        {topRiskResources.length > 0 && (
          <div className="decision-card">
            <strong>Top targeted resources</strong>
            <ul className="risk-breakdown">
              {topRiskResources.map(([resource, count]) => (
                <li key={resource}>
                  {resource}: {count} event{count > 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className="glass-card panel">
        <h2>Active Cloud Policies</h2>
        <div className="settings-actions policy-filters">
          <input
            value={policySearch}
            onChange={(event) => setPolicySearch(event.target.value)}
            placeholder="Search resource, action, condition"
          />
          <select value={policyDecisionFilter} onChange={(event) => setPolicyDecisionFilter(event.target.value)}>
            <option value="ALL">All decisions</option>
            <option value="ALLOW">ALLOW</option>
            <option value="CHALLENGE">CHALLENGE</option>
            <option value="DENY">DENY</option>
          </select>
        </div>
        {filteredPolicies.length === 0 && <p className="muted">No policies for this filter.</p>}
        <table className="policies-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Action</th>
              <th>Decision</th>
              <th>Min Risk</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.resource}</td>
                <td>{policy.action}</td>
                <td>{policy.decision}</td>
                <td>{policy.minRiskScore ?? '-'}</td>
                <td>{policy.condition ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

