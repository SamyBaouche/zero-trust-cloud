import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getCurrentContext, getCurrentUserProfile } from '../services/contextService'
import DecisionBadge from '../components/dashboard/DecisionBadge'
import LogsTable from '../components/dashboard/LogsTable'
import { useAuth } from '../context/AuthContext'
import { submitAccessCheck } from '../services/accessService'
import { fetchLogs } from '../services/logService'
import { fetchPolicies } from '../services/policyService'
import { fetchAlerts } from '../services/alertService'
import type { AccessCheckRequest, AccessCheckResponse, AccessLog } from '../types/access'
import type { Policy } from '../types/policy'
import type { SecurityAlert } from '../types/alert'
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
const CLOUD_ACTIONS = [
  'READ',
  'WRITE',
  'DELETE',
  'DEPLOY',
  'ASSUME_ROLE',
  'DOWNLOAD_SECRET',
]

const defaultPayload: AccessCheckRequest = {
  resource: 's3://finance-reports',
  action: 'read',
  ipAddress: '192.168.1.8',
  location: 'Paris, FR',
  device: 'Managed laptop',
}

export default function DashboardPage() {
  const { userEmail } = useAuth()
  const [formData, setFormData] = useState<AccessCheckRequest>(defaultPayload)
  const [latestDecision, setLatestDecision] = useState<AccessCheckResponse | null>(null)
  const [requestLoading, setRequestLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
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

  /** Reloads alerts from the backend and filters them for the current user. */
  const refreshAlerts = async () => {
    if (!normalizedUserEmail) {
      setAlerts([])
      return
    }

    try {
      const data = await fetchAlerts()
      setAlerts(
        data.filter((alert) => (alert.userEmail ?? '').trim().toLowerCase() === normalizedUserEmail),
      )
    } catch {
      setAlerts([])
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

  useEffect(() => {
    // Policies are not user-specific, so we load them once.
    fetchPolicies().then(setPolicies).catch(() => setPolicies([]))
  }, [])

  // We intentionally refresh user-related panels only when the authenticated user changes.
  // The helper functions are defined inline in this component and are not memoized.
  useEffect(() => {
    // When auth state changes, refresh all user-tied panels.
    if (!userEmail) {
      setLogs([])
      setAlerts([])
      setLatestDecision(null)
      setLogsError(null)
      setProfile(null)
      setProfileError(null)
      return
    }
    void refreshLogs()
    void refreshAlerts()
    void refreshProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

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

  const recentActivity = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
  }, [logs])

  const displayValue = (value?: string | null) => (value && value.trim() ? value : '-')
  const displayDate = (value?: string | null) => {
    if (!value) {
      return '-'
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
  }

  const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
  const avatarLabel = profileName
    ? profileName
        .split(' ')
        .map((chunk) => chunk[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ZT'

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
        <h2>Security Alerts</h2>
        {alerts.length === 0 && <p className="muted">No alerts or alerts endpoint unavailable.</p>}
        <div className="alerts-list">
          {alerts.map((alert) => (
            <article key={alert.id} className={`alert-card alert-${alert.type.toLowerCase()}`}>
              <strong>{alert.type.replace(/_/g, ' ')}</strong>
              <span>{alert.message}</span>
              <div className="muted" style={{ fontSize: '0.95em' }}>
                {alert.resource} {alert.action && `(${alert.action})`}
                <br />
                Risk: {alert.riskScore} | {new Date(alert.createdAt).toLocaleString()}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="glass-card panel">
        <h2>Active Cloud Policies</h2>
        {policies.length === 0 && <p className="muted">No policies or policies endpoint unavailable.</p>}
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
            {policies.map((policy) => (
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

