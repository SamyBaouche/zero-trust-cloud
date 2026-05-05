import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { inject } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/dist/react/index.mjs'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './styles/global.css'

inject()

/**
 * Frontend entry point.
 * <p>
 * This file creates the React root and mounts the full application.
 * We also register global providers (Theme, Language, Auth) so any component
 * can access them via custom hooks.
 */
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* ThemeProvider: controls dark/light mode and persists the choice. */}
        <ThemeProvider>
            {/* LanguageProvider: simple i18n helper + persistence in localStorage. */}
            <LanguageProvider>
                {/* AuthProvider: stores JWT token and exposes login/logout helpers. */}
                <AuthProvider>
                    {/* BrowserRouter: enables client-side routing (/login, /dashboard, etc.). */}
                    <BrowserRouter>
                        <App />
                        <SpeedInsights />
                    </BrowserRouter>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    </StrictMode>,
)