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
