import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * LanguageContext provides a very small i18n (internationalization) layer.
 * <p>
 * How it works:
 * - We store the current language (en/fr) in React state
 * - We persist it in localStorage so refresh keeps your choice
 * - We expose a `t(key)` function that reads from the `translations` object
 * <p>
 * This is intentionally simple for learning purposes (no external i18n library).
 */
export type Language = 'en' | 'fr'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LANGUAGE_STORAGE_KEY = 'ztc_language'

/**
 * In-memory dictionary of translation keys.
 * <p>
 * Tip for juniors: keep keys stable, and only translate the values.
 */
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.login': 'Login',
    'nav.register': 'Register',

    'landing.kicker': 'Zero Trust Security Platform',
    'landing.title': 'Zero Trust Cloud',
    'landing.subtitle': 'Secure access. Smart decisions. Full visibility.',
    'landing.description':
      'A modern cloud security platform implementing Zero Trust principles with real-time risk-based access evaluation.',
    'landing.getStarted': 'Get Started',
    'landing.coreFeatures': 'Core Features',
    'landing.howItWorks': 'How It Works',
    'landing.cta': 'Start securing your cloud environment today.',
    'landing.createAccount': 'Create Account',
    'landing.footerTitle': 'Zero Trust Cloud',
    'landing.footerDescription':
      'Cloud-native security platform for contextual access control and audit visibility.',
    'landing.footerBuilt': 'Built with Spring Boot and React.',

    'feature.risk.title': 'Risk-Based Access Decisions',
    'feature.risk.description':
      'Evaluate each access request using a dynamic risk scoring system based on context such as IP, location, action, and resource.',
    'feature.access.title': 'Access Control Engine',
    'feature.access.description':
      'Automatically decide whether to ALLOW, CHALLENGE, or DENY access based on calculated risk.',
    'feature.logs.title': 'Audit Logs & Monitoring',
    'feature.logs.description':
      'Store and display all access attempts with full details for security auditing and monitoring.',
    'feature.auth.title': 'Secure Authentication',
    'feature.auth.description':
      'Authenticate users using JWT and protect access to sensitive operations.',

    'steps.auth.title': 'User Authentication',
    'steps.auth.description': 'Users securely log in using JWT authentication.',
    'steps.risk.title': 'Risk Evaluation',
    'steps.risk.description':
      'Each request is evaluated using context (IP, location, action, resource).',
    'steps.decision.title': 'Access Decision',
    'steps.decision.description':
      'The system returns ALLOW, CHALLENGE, or DENY based on calculated risk.',

    'login.title': 'Welcome back',
    'login.subtitle': 'Sign in to your Zero Trust workspace.',
    'login.required': 'Email and password are required.',
    'login.invalid': 'Invalid login. Please check your credentials.',
    'login.loading': 'Signing in...',
    'login.noAccount': "Don't have an account?",
    'login.createAccount': 'Create account',

    'register.title': 'Create your account',
    'register.subtitle': 'Launch your Zero Trust environment in seconds.',
    'register.required': 'Email and password are required.',
    'register.requiredExtended':
      'Email, password, first name, last name, and date of birth are required.',
    'register.passwordRule': 'Password must contain at least 8 characters.',
    'register.emailInUse': 'Email is already in use. Try another email.',
    'register.success': 'Account created successfully. You can now log in.',
    'register.error': 'Registration failed. Try with another email.',
    'register.loading': 'Creating account...',
    'register.firstName': 'First name',
    'register.firstNamePlaceholder': 'Alex',
    'register.lastName': 'Last name',
    'register.lastNamePlaceholder': 'Martin',
    'register.dateOfBirth': 'Date of birth',
    'register.company': 'Company',
    'register.companyPlaceholder': 'Maple Secure',
    'register.jobTitle': 'Job title',
    'register.jobTitlePlaceholder': 'Cloud Security Analyst',
    'register.country': 'Country',
    'register.countryPlaceholder': 'Canada',
    'register.phone': 'Phone',
    'register.phonePlaceholder': '+1 416 555 0123',
    'register.department': 'Department',
    'register.departmentPlaceholder': 'SOC Toronto',
    'register.securityClearance': 'Security clearance',
    'register.passwordPlaceholder': 'Minimum 8 characters',
    'register.haveAccount': 'Already registered?',
    'register.signIn': 'Sign in',

    'private.authenticatedUser': 'Authenticated user',
    'private.dashboard': 'Dashboard',
    'private.auditLogs': 'Audit logs',
    'private.logout': 'Logout',

    'dashboard.userProfile': 'User Profile',
    'dashboard.unknownUser': 'Unknown user',
    'dashboard.statusAuthenticated': 'Status: Authenticated',
    'dashboard.session': 'Session',
    'dashboard.securityOverview': 'Security Overview',
    'dashboard.totalLogs': 'Total logs',
    'dashboard.recentActivity': 'Recent activity',
    'dashboard.noRecentActivity': 'No recent activity.',
    'dashboard.accessCheckEngine': 'Access Check Engine',
    'dashboard.checkAccess': 'Check access',
    'dashboard.analyzing': 'Analyzing...',
    'dashboard.riskScore': 'Risk Score',
    'dashboard.recentAccessLogs': 'Recent Access Logs',
    'dashboard.refresh': 'Refresh',
    'dashboard.logsEndpointError':
      'Logs endpoint unavailable. Verify backend route /logs (or /access/logs).',
    'dashboard.requestUnavailable': 'Request denied or service unavailable.',

    'logs.title': 'Audit Logs',
    'logs.error': 'Unable to fetch logs.',
    'logs.allDecisions': 'All decisions',

    'table.empty': 'No logs available yet.',
    'table.user': 'User',
    'table.resource': 'Resource',
    'table.action': 'Action',
    'table.decision': 'Decision',
    'table.ip': 'IP',
    'table.location': 'Location',
    'table.device': 'Device',
    'table.timestamp': 'Timestamp',

    'notFound.title': 'Page not found',
    'notFound.description': 'The requested route does not exist.',
    'notFound.backHome': 'Back to home',

    'language.switchToFrench': 'Switch to French',
    'language.switchToEnglish': 'Switch to English',

    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your profile, appearance, and account security.',
    'settings.profile.title': 'Profile information',
    'settings.profile.save': 'Save profile',
    'settings.profile.saved': 'Profile updated successfully.',
    'settings.profile.export': 'Export profile (JSON)',
    'settings.appearance.title': 'Appearance and language',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.theme.dark': 'Dark',
    'settings.theme.light': 'Light',
    'settings.account.title': 'Danger zone',
    'settings.account.deleteHint': 'Delete your account permanently. This action cannot be undone.',
    'settings.account.password': 'Current password',
    'settings.account.delete': 'Delete account',
    'settings.account.deleted': 'Account deleted successfully.',
    'settings.requiredPassword': 'Password is required to delete your account.',

    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
  },
  fr: {
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',

    'landing.kicker': 'Plateforme de securite Zero Trust',
    'landing.title': 'Zero Trust Cloud',
    'landing.subtitle': 'Acces securise. Decisions intelligentes. Visibilite totale.',
    'landing.description':
      'Une plateforme moderne de securite cloud qui applique les principes Zero Trust avec une evaluation des acces en temps reel basee sur le risque.',
    'landing.getStarted': 'Commencer',
    'landing.coreFeatures': 'Fonctionnalites principales',
    'landing.howItWorks': 'Comment ca marche',
    'landing.cta': 'Commencez a securiser votre environnement cloud des aujourd hui.',
    'landing.createAccount': 'Creer un compte',
    'landing.footerTitle': 'Zero Trust Cloud',
    'landing.footerDescription':
      'Plateforme de securite cloud native pour le controle d acces contextuel et la visibilite des audits.',
    'landing.footerBuilt': 'Construit avec Spring Boot et React.',

    'feature.risk.title': 'Decisions d acces basees sur le risque',
    'feature.risk.description':
      'Chaque requete est evaluee via un score de risque dynamique selon le contexte: IP, localisation, action et ressource.',
    'feature.access.title': 'Moteur de controle d acces',
    'feature.access.description':
      'Le systeme decide automatiquement ALLOW, CHALLENGE ou DENY en fonction du risque calcule.',
    'feature.logs.title': 'Journaux d audit et monitoring',
    'feature.logs.description':
      'Toutes les tentatives d acces sont stockees et affichees avec des details complets pour l audit et la supervision.',
    'feature.auth.title': 'Authentification securisee',
    'feature.auth.description':
      'Les utilisateurs sont authentifies via JWT pour proteger l acces aux operations sensibles.',

    'steps.auth.title': 'Authentification utilisateur',
    'steps.auth.description': 'Les utilisateurs se connectent de facon securisee avec JWT.',
    'steps.risk.title': 'Evaluation du risque',
    'steps.risk.description':
      'Chaque requete est evaluee avec son contexte (IP, localisation, action, ressource).',
    'steps.decision.title': 'Decision d acces',
    'steps.decision.description':
      'Le systeme renvoie ALLOW, CHALLENGE ou DENY selon le risque calcule.',

    'login.title': 'Bon retour',
    'login.subtitle': 'Connectez-vous a votre espace Zero Trust.',
    'login.required': 'Email et mot de passe sont requis.',
    'login.invalid': 'Connexion invalide. Verifiez vos identifiants.',
    'login.loading': 'Connexion...',
    'login.noAccount': "Pas de compte ?",
    'login.createAccount': 'Creer un compte',

    'register.title': 'Creez votre compte',
    'register.subtitle': 'Lancez votre environnement Zero Trust en quelques secondes.',
    'register.required': 'Email et mot de passe sont requis.',
    'register.requiredExtended':
      'Email, mot de passe, prenom, nom et date de naissance sont requis.',
    'register.passwordRule': 'Le mot de passe doit contenir au moins 8 caracteres.',
    'register.emailInUse': 'Cet email est deja utilise. Essayez-en un autre.',
    'register.success': 'Compte cree avec succes. Vous pouvez maintenant vous connecter.',
    'register.error': 'Inscription impossible. Essayez avec un autre email.',
    'register.loading': 'Creation...',
    'register.firstName': 'Prenom',
    'register.firstNamePlaceholder': 'Alex',
    'register.lastName': 'Nom',
    'register.lastNamePlaceholder': 'Tremblay',
    'register.dateOfBirth': 'Date de naissance',
    'register.company': 'Entreprise',
    'register.companyPlaceholder': 'Maple Secure',
    'register.jobTitle': 'Poste',
    'register.jobTitlePlaceholder': 'Analyste securite cloud',
    'register.country': 'Pays',
    'register.countryPlaceholder': 'Canada',
    'register.phone': 'Telephone',
    'register.phonePlaceholder': '+1 514 555 0198',
    'register.department': 'Departement',
    'register.departmentPlaceholder': 'SOC Montreal',
    'register.securityClearance': 'Niveau de clearance',
    'register.passwordPlaceholder': 'Minimum 8 caracteres',
    'register.haveAccount': 'Deja inscrit ?',
    'register.signIn': 'Se connecter',

    'private.authenticatedUser': 'Utilisateur authentifie',
    'private.dashboard': 'Tableau de bord',
    'private.auditLogs': 'Journaux d audit',
    'private.logout': 'Deconnexion',

    'dashboard.userProfile': 'Profil utilisateur',
    'dashboard.unknownUser': 'Utilisateur inconnu',
    'dashboard.statusAuthenticated': 'Statut: Authentifie',
    'dashboard.session': 'Session',
    'dashboard.securityOverview': 'Vue securite',
    'dashboard.totalLogs': 'Total des logs',
    'dashboard.recentActivity': 'Activite recente',
    'dashboard.noRecentActivity': 'Aucune activite recente.',
    'dashboard.accessCheckEngine': 'Moteur de verification d acces',
    'dashboard.checkAccess': 'Verifier acces',
    'dashboard.analyzing': 'Analyse...',
    'dashboard.riskScore': 'Score de risque',
    'dashboard.recentAccessLogs': 'Derniers logs d acces',
    'dashboard.refresh': 'Rafraichir',
    'dashboard.logsEndpointError':
      'Endpoint logs indisponible. Verifiez la route backend /logs (ou /access/logs).',
    'dashboard.requestUnavailable': 'Requete refusee ou service indisponible.',

    'logs.title': 'Journaux d audit',
    'logs.error': 'Impossible de recuperer les logs.',
    'logs.allDecisions': 'Toutes les decisions',

    'table.empty': 'Aucun log disponible pour le moment.',
    'table.user': 'Utilisateur',
    'table.resource': 'Ressource',
    'table.action': 'Action',
    'table.decision': 'Decision',
    'table.ip': 'IP',
    'table.location': 'Localisation',
    'table.device': 'Appareil',
    'table.timestamp': 'Horodatage',

    'notFound.title': 'Page introuvable',
    'notFound.description': "La route demandee n existe pas.",
    'notFound.backHome': "Retour a l accueil",

    'language.switchToFrench': 'Passer en francais',
    'language.switchToEnglish': 'Passer en anglais',

    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez votre profil, l’apparence et la sécurité de votre compte.',
    'settings.profile.title': 'Informations du profil',
    'settings.profile.save': 'Enregistrer le profil',
    'settings.profile.saved': 'Profil mis à jour avec succès.',
    'settings.profile.export': 'Exporter le profil (JSON)',
    'settings.appearance.title': 'Apparence et langue',
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.theme.dark': 'Sombre',
    'settings.theme.light': 'Clair',
    'settings.account.title': 'Zone sensible',
    'settings.account.deleteHint': 'Supprimez votre compte définitivement. Cette action est irréversible.',
    'settings.account.password': 'Mot de passe actuel',
    'settings.account.delete': 'Supprimer le compte',
    'settings.account.deleted': 'Compte supprimé avec succès.',
    'settings.requiredPassword': 'Le mot de passe est requis pour supprimer votre compte.',

    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
  },
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

/**
 * Reads the initial language from localStorage (defaults to English).
 */
function getInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'en' || stored === 'fr') {
    return stored
  }
  return 'en'
}

/**
 * LanguageProvider wraps the app and gives access to language state + `t()`.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    // Persist choice and update the <html lang="..."> attribute for accessibility.
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language === 'fr' ? 'fr' : 'en'
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === 'en' ? 'fr' : 'en')),
      t: (key: string) => translations[language][key] ?? key,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/**
 * useLanguage returns the current language and helpers.
 * <p>
 * Must be used inside {@link LanguageProvider}.
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
