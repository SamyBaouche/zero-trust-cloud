import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage, type Language } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  deleteCurrentAccount,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from '../services/contextService'
import type { UpdateUserProfileRequest, UserProfile } from '../types/auth'
import axios from 'axios'

const CLEARANCE_OPTIONS = ['Public', 'Internal', 'Confidential', 'Secret'] as const

type EditableProfile = Required<UpdateUserProfileRequest>

/**
 * Converts a backend profile response into a fully-editable form model.
 * <p>
 * We use empty strings instead of null/undefined so inputs remain controlled.
 */
function toEditableProfile(profile: UserProfile): EditableProfile {
  return {
    email: profile.email ?? '',
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    dateOfBirth: profile.dateOfBirth ?? '',
    company: profile.company ?? '',
    jobTitle: profile.jobTitle ?? '',
    country: profile.country ?? '',
    phone: profile.phone ?? '',
    department: profile.department ?? '',
    securityClearance: profile.securityClearance ?? 'Internal',
  }
}

/**
 * SettingsPage lets an authenticated user:
 * - edit and save their profile (/context/profile)
 * - change theme/language
 * - export profile as JSON
 * - delete their account (/context/account)
 */
export default function SettingsPage() {
  const navigate = useNavigate()
  const { userEmail, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const [profile, setProfile] = useState<EditableProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        // Load the current profile once when the page mounts.
        const data = await getCurrentUserProfile()
        setProfile(toEditableProfile(data))
      } catch {
        setError('Unable to load profile settings.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const canSave = useMemo(() => {
    if (!profile) {
      return false
    }
    return Boolean(profile.email.trim() && profile.firstName.trim() && profile.lastName.trim())
  }, [profile])

  const handleProfileChange = (field: keyof EditableProfile, value: string) => {
    setProfile((current) => {
      if (!current) {
        return current
      }
      return { ...current, [field]: value }
    })
  }

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!profile || !canSave || saving) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare payload: trim strings and avoid sending empty values.
      const payload: UpdateUserProfileRequest = {
        email: profile.email.trim(),
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        dateOfBirth: profile.dateOfBirth || undefined,
        company: profile.company.trim() || undefined,
        jobTitle: profile.jobTitle.trim() || undefined,
        country: profile.country.trim() || undefined,
        phone: profile.phone.trim() || undefined,
        department: profile.department.trim() || undefined,
        securityClearance: profile.securityClearance.trim() || undefined,
      }

      const updated = await updateCurrentUserProfile(payload)
      setProfile(toEditableProfile(updated))

      // If email changed, the JWT subject might not match anymore. We force re-login.
      const emailChanged = userEmail && updated.email && userEmail.toLowerCase() !== updated.email.toLowerCase()
      if (emailChanged) {
        logout()
        navigate('/login', {
          replace: true,
          state: { successMessage: 'Profile updated. Please sign in again with your new email.' },
        })
        return
      }

      setSuccess(t('settings.profile.saved'))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage =
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string } | undefined)?.message
        setError(apiMessage || 'Unable to save profile settings.')
      } else {
        setError('Unable to save profile settings.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleting) {
      return
    }
    if (!deletePassword.trim()) {
      setError(t('settings.requiredPassword'))
      return
    }

    setDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      // Backend requires password confirmation to delete an account.
      await deleteCurrentAccount({ password: deletePassword })
      logout()
      navigate('/login', {
        replace: true,
        state: { successMessage: t('settings.account.deleted') },
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiMessage =
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string } | undefined)?.message
        setError(apiMessage || 'Unable to delete account.')
      } else {
        setError('Unable to delete account.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleExportProfile = () => {
    if (!profile) {
      return
    }
    // Create a local JSON file download from in-memory data.
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
    const fileName = `profile-${(profile.email || 'user').replace(/[^a-zA-Z0-9._-]/g, '_')}.json`
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  if (loading || !profile) {
    return (
      <section className="glass-card panel panel-wide">
        <h2>{t('settings.title')}</h2>
        <p className="muted">{t('common.loading')}</p>
      </section>
    )
  }

  return (
    <section className="glass-card panel panel-wide settings-page">
      <h2>{t('settings.title')}</h2>
      <p className="muted">{t('settings.subtitle')}</p>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form className="settings-form" onSubmit={handleSaveProfile}>
        <h3>{t('settings.profile.title')}</h3>
        <div className="register-form-grid">
          <div className="register-field">
            <label htmlFor="settings-email">Email</label>
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              onChange={(event) => handleProfileChange('email', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-first-name">{t('register.firstName')}</label>
            <input
              id="settings-first-name"
              type="text"
              value={profile.firstName}
              onChange={(event) => handleProfileChange('firstName', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-last-name">{t('register.lastName')}</label>
            <input
              id="settings-last-name"
              type="text"
              value={profile.lastName}
              onChange={(event) => handleProfileChange('lastName', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-dob">{t('register.dateOfBirth')}</label>
            <input
              id="settings-dob"
              type="date"
              value={profile.dateOfBirth}
              onChange={(event) => handleProfileChange('dateOfBirth', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-company">{t('register.company')}</label>
            <input
              id="settings-company"
              type="text"
              value={profile.company}
              onChange={(event) => handleProfileChange('company', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-job-title">{t('register.jobTitle')}</label>
            <input
              id="settings-job-title"
              type="text"
              value={profile.jobTitle}
              onChange={(event) => handleProfileChange('jobTitle', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-country">{t('register.country')}</label>
            <input
              id="settings-country"
              type="text"
              value={profile.country}
              onChange={(event) => handleProfileChange('country', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-phone">{t('register.phone')}</label>
            <input
              id="settings-phone"
              type="tel"
              value={profile.phone}
              onChange={(event) => handleProfileChange('phone', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-department">{t('register.department')}</label>
            <input
              id="settings-department"
              type="text"
              value={profile.department}
              onChange={(event) => handleProfileChange('department', event.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="settings-clearance">{t('register.securityClearance')}</label>
            <select
              id="settings-clearance"
              value={profile.securityClearance}
              onChange={(event) => handleProfileChange('securityClearance', event.target.value)}
            >
              {CLEARANCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="primary-button" disabled={!canSave || saving}>
            {saving ? t('common.loading') : t('settings.profile.save')}
          </button>
          <button type="button" className="ghost-button" onClick={handleExportProfile}>
            {t('settings.profile.export')}
          </button>
        </div>
      </form>

      <section className="settings-block">
        <h3>{t('settings.appearance.title')}</h3>
        <div className="settings-actions">
          <label htmlFor="settings-language">{t('settings.language')}</label>
          <select
            id="settings-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>

          <label htmlFor="settings-theme">{t('settings.theme')}</label>
          <select
            id="settings-theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value === 'light' ? 'light' : 'dark')}
          >
            <option value="dark">{t('settings.theme.dark')}</option>
            <option value="light">{t('settings.theme.light')}</option>
          </select>
        </div>
      </section>

      <section className="settings-block settings-danger-zone">
        <h3>{t('settings.account.title')}</h3>
        <p className="muted">{t('settings.account.deleteHint')}</p>
        <div className="settings-actions">
          <input
            type="password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
            placeholder={t('settings.account.password')}
          />
          <button type="button" className="danger-button" onClick={() => void handleDeleteAccount()} disabled={deleting}>
            {deleting ? t('common.loading') : t('settings.account.delete')}
          </button>
        </div>
      </section>
    </section>
  )
}
