import { useLanguage } from '../../context/LanguageContext'

/**
 * LanguageToggle switches between English and French.
 * <p>
 * The LanguageContext persists the choice in localStorage.
 */
export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage()
  const isEnglish = language === 'en'

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={isEnglish ? t('language.switchToFrench') : t('language.switchToEnglish')}
      title={isEnglish ? t('language.switchToFrench') : t('language.switchToEnglish')}
    >
      <span aria-hidden="true" className="language-flag">
        {isEnglish ? '🇬🇧' : '🇫🇷'}
      </span>
      <span className="language-code">{isEnglish ? 'EN' : 'FR'}</span>
    </button>
  )
}


