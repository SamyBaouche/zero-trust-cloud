import DecisionBadge from './DecisionBadge'
import type { AccessLog } from '../../types/access'

interface LogsTableProps {
  logs: AccessLog[]
  loading?: boolean
  compact?: boolean
}

/**
 * LogsTable renders access logs in a simple HTML table.
 * <p>
 * Features:
 * - Loading skeleton UI
 * - Empty state
 * - Optional compact mode to hide less important columns
 */
export default function LogsTable({ logs, loading, compact }: LogsTableProps) {
  if (loading) {
    // Skeleton placeholder while data is loading.
    return (
      <div className="skeleton-block" aria-live="polite" aria-busy="true">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    )
  }

  if (!logs.length) {
    // Friendly message when there is no data yet.
    return <p className="muted">No logs available yet.</p>
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
            <th>Risk</th>
            <th>Reasons</th>
            {/* Compact mode hides network/device columns to fit smaller panels. */}
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
              <td>{log.riskScore ?? '-'}</td>
              <td>
                {log.reasons && log.reasons.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {log.reasons.map((reason, i) => (
                      <li key={i} style={{ fontSize: '0.95em' }}>
                        {reason}
                      </li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
                {log.message && (
                  <div style={{ fontSize: '0.9em', color: '#888' }}>
                    {log.message}
                  </div>
                )}
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
