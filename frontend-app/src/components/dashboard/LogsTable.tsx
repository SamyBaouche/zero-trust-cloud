import DecisionBadge from './DecisionBadge'
import type { AccessLog } from '../../types/access'

interface LogsTableProps {
  logs: AccessLog[]
  loading?: boolean
  compact?: boolean
}

export default function LogsTable({ logs, loading, compact }: LogsTableProps) {
  if (loading) {
    return (
      <div className="skeleton-block" aria-live="polite" aria-busy="true">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    )
  }

  if (!logs.length) {
    return <p className="muted">Aucun log disponible pour le moment.</p>
  }

  return (
    <div className="table-wrapper">
      <table className="logs-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Resource</th>
            <th>Action</th>
            <th>Decision</th>
            {!compact && <th>IP</th>}
            {!compact && <th>Location</th>}
            {!compact && <th>Device</th>}
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={`${log.createdAt}-${index}`}>
              <td>{log.userEmail}</td>
              <td>{log.resource}</td>
              <td>{log.action}</td>
              <td>
                <DecisionBadge decision={log.decision} />
              </td>
              {!compact && <td>{log.ipAddress}</td>}
              {!compact && <td>{log.location}</td>}
              {!compact && <td>{log.device}</td>}
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


