import { useEffect, useMemo, useState, type FormEvent } from 'react'
import DecisionBadge from '../components/dashboard/DecisionBadge'
import LogsTable from '../components/dashboard/LogsTable'
import { useAuth } from '../context/AuthContext'
import { submitAccessCheck } from '../services/accessService'
import { fetchLogs } from '../services/logService'
import type { AccessCheckRequest, AccessCheckResponse, AccessLog } from '../types/access'

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

  const refreshLogs = async () => {
    setLogsLoading(true)
    setLogsError(null)

    try {
      const data = await fetchLogs()
      setLogs(data)
    } catch {
      setLogsError('Endpoint logs indisponible. Verifiez la route backend /logs (ou /access/logs).')
      setLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    void refreshLogs()
  }, [])

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRequestLoading(true)

    try {
      const response = await submitAccessCheck(formData)
      setLatestDecision(response)
      await refreshLogs()
    } catch {
      setLatestDecision({
        decision: 'DENY',
        riskScore: 100,
        message: 'Requete refusee ou service indisponible.',
      })
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <div className="dashboard-grid">
      <section className="glass-card panel">
        <h2>User Profile</h2>
        <div className="profile-row">
          <span className="avatar">ZT</span>
          <div>
            <p>{userEmail ?? 'Utilisateur inconnu'}</p>
            <p className="muted">Statut: Authentifie</p>
            <p className="muted">Session: {new Date().toLocaleString()}</p>
          </div>
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
            <p className="muted">Aucune activite recente.</p>
          )}
        </div>
      </section>

      <section className="glass-card panel panel-wide">
        <h2>Access Check Engine</h2>
        <form className="access-form" onSubmit={handleSubmit}>
          <input
            value={formData.resource}
            onChange={(event) => setFormData((prev) => ({ ...prev, resource: event.target.value }))}
            placeholder="resource"
            required
          />
          <input
            value={formData.action}
            onChange={(event) => setFormData((prev) => ({ ...prev, action: event.target.value }))}
            placeholder="action"
            required
          />
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
            {requestLoading ? 'Analyse...' : 'Check access'}
          </button>
        </form>

        {latestDecision && (
          <div className="decision-card">
            <DecisionBadge decision={latestDecision.decision} />
            <p>Risk Score: {latestDecision.riskScore}</p>
            <p className="muted">{latestDecision.message}</p>
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
    </div>
  )
}


