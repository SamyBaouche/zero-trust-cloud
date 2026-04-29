import { useEffect, useState } from 'react'
import DecisionBadge from '../components/dashboard/DecisionBadge'
import { fetchAttackScenarios, runAttackSimulation } from '../services/accessService'
import type { AccessCheckResponse, AttackScenario } from '../types/access'

/**
 * AttackSimulatorPage allows users to run predefined scenarios through the access engine.
 * <p>
 * This is useful for demos: you can quickly generate risky contexts and see how the system responds.
 */
export default function AttackSimulatorPage() {
  const [scenarios, setScenarios] = useState<AttackScenario[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [result, setResult] = useState<AccessCheckResponse | null>(null)
  const [loadingScenarios, setLoadingScenarios] = useState(true)
  const [runningSimulation, setRunningSimulation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadScenarios = async () => {
      setLoadingScenarios(true)
      setError(null)
      try {
        // Scenarios are defined on the backend.
        const data = await fetchAttackScenarios()
        setScenarios(data)
        if (data.length > 0) {
          // Auto-select the first scenario for convenience.
          setSelectedScenarioId(data[0].id)
        }
      } catch {
        setError('Unable to load attack scenarios.')
      } finally {
        setLoadingScenarios(false)
      }
    }

    void loadScenarios()
  }, [])

  const selectedScenario = scenarios.find((item) => item.id === selectedScenarioId) ?? null

  const handleRunSimulation = async () => {
    if (!selectedScenarioId) {
      return
    }
    setRunningSimulation(true)
    setError(null)
    try {
      // POST /access/simulate/:id
      const response = await runAttackSimulation(selectedScenarioId)
      setResult(response)
    } catch {
      setError('Simulation failed. Please try again.')
      setResult(null)
    } finally {
      setRunningSimulation(false)
    }
  }

  return (
    <section className="glass-card panel panel-wide">
      <div className="panel-heading">
        <h2>Attack Simulator</h2>
      </div>
      <p className="muted">Run realistic Zero Trust attack scenarios and inspect the decision engine.</p>

      {loadingScenarios ? (
        <p className="muted">Loading scenarios...</p>
      ) : (
        <div className="simulator-grid">
          <div className="simulator-list">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`simulator-item ${selectedScenarioId === scenario.id ? 'active' : ''}`}
                onClick={() => setSelectedScenarioId(scenario.id)}
              >
                <strong>{scenario.title}</strong>
                <span>{scenario.description}</span>
              </button>
            ))}
          </div>

          <div className="simulator-detail glass-card">
            {selectedScenario ? (
              <>
                <h3>Scenario context</h3>
                <p>
                  <strong>Resource:</strong> {selectedScenario.resource}
                </p>
                <p>
                  <strong>Action:</strong> {selectedScenario.action}
                </p>
                <p>
                  <strong>IP:</strong> {selectedScenario.ipAddress}
                </p>
                <p>
                  <strong>Location:</strong> {selectedScenario.location}
                </p>
                <p>
                  <strong>Device:</strong> {selectedScenario.device}
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => void handleRunSimulation()}
                  disabled={runningSimulation}
                >
                  {runningSimulation ? 'Running simulation...' : 'Run simulation'}
                </button>
              </>
            ) : (
              <p className="muted">No scenario selected.</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="decision-card" style={{ marginTop: '1rem' }}>
          <DecisionBadge decision={result.decision} />
          <p>
            Risk Score: {result.riskScore}
          </p>
          <p className="muted">{result.message}</p>
          {result.reasons && result.reasons.length > 0 && (
            <ul className="risk-breakdown">
              {result.reasons.map((reason, index) => (
                <li key={`${reason}-${index}`}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}



