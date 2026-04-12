import { useEffect, useMemo, useState } from 'react'
import LogsTable from '../components/dashboard/LogsTable'
import { fetchLogs } from '../services/logService'
import type { AccessDecision, AccessLog } from '../types/access'

export default function LogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [decisionFilter, setDecisionFilter] = useState<AccessDecision | 'ALL'>('ALL')

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchLogs()
        setLogs(data)
      } catch {
        setError('Impossible de recuperer les logs.')
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    void loadLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    if (decisionFilter === 'ALL') {
      return logs
    }

    return logs.filter((log) => log.decision.toUpperCase() === decisionFilter)
  }, [decisionFilter, logs])

  return (
    <section className="glass-card panel">
      <div className="panel-heading">
        <h2>Audit Logs</h2>
        <select
          value={decisionFilter}
          onChange={(event) => setDecisionFilter(event.target.value as AccessDecision | 'ALL')}
        >
          <option value="ALL">All decisions</option>
          <option value="ALLOW">ALLOW</option>
          <option value="CHALLENGE">CHALLENGE</option>
          <option value="DENY">DENY</option>
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      <LogsTable logs={filteredLogs} loading={loading} />
    </section>
  )
}

