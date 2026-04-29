import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import axios from 'axios'

const SECURITY_CLEARANCE_OPTIONS = ['Public', 'Internal', 'Confidential', 'Secret'] as const

/**
 * RegisterPage creates a new account by calling the backend registration endpoint.
 * <p>
 * We collect identity fields (email/password/name/DOB) + optional profile fields.
 * Those optional fields can later be used by the backend as "security context".
 */
export default function RegisterPage() {
  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [securityClearance, setSecurityClearance] = useState('Internal')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Small UX trick: this page is presented as a centered card; disabling scrolling feels cleaner.
    const previousOverflow = document.body.style.overflow
    const previousOverflowY = document.body.style.overflowY

    document.body.style.overflow = 'hidden'
    document.body.style.overflowY = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.overflowY = previousOverflowY
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) {
      return
    }

    // Required fields.
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim() || !dateOfBirth) {
      setError(t('register.requiredExtended'))
      return
    }

    if (password.trim().length < 8) {
      setError(t('register.passwordRule'))
      return
    }

    setError(null)
    setLoading(true)

    try {
      const message = await register({
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        // Optional fields (we pass `undefined` instead of empty strings).
        company: company.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        country: country.trim() || undefined,
        phone: phone.trim() || undefined,
        department: department.trim() || undefined,
        securityClearance,
      })
      const successText = message || t('register.success')
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setDateOfBirth('')
      setCompany('')
      setJobTitle('')
      setCountry('')
      setPhone('')
      setDepartment('')
      setSecurityClearance('Internal')
      navigate('/login', {
        replace: true,
        state: {
          successMessage: successText,
        },
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const apiMessage =
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string } | undefined)?.message

        // Backend uses HTTP 409 when the email already exists.
        if (status === 409) {
          setError(t('register.emailInUse'))
        } else {
          setError(apiMessage || t('register.error'))
        }
      } else {
        setError(t('register.error'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card glass-card register-card" onSubmit={handleSubmit}>
        <h2>{t('register.title')}</h2>
        <p className="muted">{t('register.subtitle')}</p>

        <div className="register-form-grid">
          <div className="register-field">
            <label htmlFor="register-first-name">{t('register.firstName')}</label>
            <input
              id="register-first-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder={t('register.firstNamePlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-last-name">{t('register.lastName')}</label>
            <input
              id="register-last-name"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder={t('register.lastNamePlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-dob">{t('register.dateOfBirth')}</label>
            <input
              id="register-dob"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="cloud@company.com"
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('register.passwordPlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-company">{t('register.company')}</label>
            <input
              id="register-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder={t('register.companyPlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-job-title">{t('register.jobTitle')}</label>
            <input
              id="register-job-title"
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder={t('register.jobTitlePlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-country">{t('register.country')}</label>
            <input
              id="register-country"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder={t('register.countryPlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-phone">{t('register.phone')}</label>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t('register.phonePlaceholder')}
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-department">{t('register.department')}</label>
            <input
              id="register-department"
              type="text"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder={t('register.departmentPlaceholder')}
            />
          </div>

          <div className="register-field register-field-clearance">
            <label htmlFor="register-clearance">{t('register.securityClearance')}</label>
            <select
              id="register-clearance"
              value={securityClearance}
              onChange={(event) => setSecurityClearance(event.target.value)}
            >
              {SECURITY_CLEARANCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? t('register.loading') : t('nav.register')}
        </button>

        <p className="muted">
          {t('register.haveAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
      </form>
    </section>
  )
}