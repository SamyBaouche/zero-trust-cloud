# Zero Trust Cloud Frontend

Frontend React + TypeScript pour une plateforme Zero Trust basee sur JWT.

## Stack

- React 19
- TypeScript
- Parcel
- React Router
- Axios (interceptors JWT)

## Demarrage

```bash
npm install
npm run dev
```

Application disponible en local via Parcel (URL affichee dans le terminal).

## Scripts

- `npm run dev` : serveur de developpement
- `npm run build` : build de production
- `npm run lint` : lint ESLint
- `npm run typecheck` : verification TypeScript

## Endpoints backend attendus

- `POST /auth/register`
- `POST /auth/login`
- `POST /access/check`
- `GET /logs` (fallback tente sur `/access/logs`)

Base URL API: `http://localhost:8081`

## Structure

- `src/components` : layout, auth, dashboard UI
- `src/pages` : Landing, Login, Register, Dashboard, Logs
- `src/context` : Auth + Theme
- `src/services` : API Axios et services metier
- `src/types` : contrats TypeScript
- `src/router` : routing central et routes protegees

## Code Tour (Junior-Friendly)

This frontend follows a simple layered structure:

- **Pages** (`src/pages`): full screens tied to a route (`/login`, `/dashboard`, ...).
- **Components** (`src/components`): reusable UI building blocks (tables, layouts, toggles).
- **Context** (`src/context`): global state (auth token, theme, language).
- **Services** (`src/services`): API calls to the backend (Axios + small helper functions).
- **Types** (`src/types`): TypeScript interfaces matching backend JSON contracts.

### Key flows

- **Login flow**
  1. `LoginPage` calls `useAuth().login(...)`
  2. `AuthContext` calls `loginRequest()` (`POST /auth/login`)
  3. Token is stored via `storage.ts` (localStorage)
  4. `apiClient` attaches the token on subsequent requests

- **Unauthorized (401) flow**
  1. Backend returns 401
  2. `apiClient` removes the token and dispatches `auth:unauthorized`
  3. `AuthContext` listens to that event and logs out
  4. Protected routes redirect back to `/login`

### Documentation style

The code uses short, beginner-friendly **English JSDoc** comments to explain:

- what a module/component does
- why a piece of logic exists (more important than describing obvious syntax)
- which backend endpoint a service function calls

Tip: start reading from `src/main.tsx` (providers) then `src/router/AppRouter.tsx` (routes).

