import AppRouter from './router/AppRouter.tsx'

/**
 * Top-level React component.
 * <p>
 * We keep this file intentionally small: it delegates navigation concerns to {@link AppRouter}.
 */
export default function App() {
  return <AppRouter />
}

