import { useLanguage } from "../context/LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      type="button"
      className={`language-switcher-btn ${className}`.trim()}
      onClick={toggleLanguage}
      title={t("language.switch")}
      aria-label={t("language.switch")}
      data-testid="language-switcher-button"
    >
      <span className="lang-flag" aria-hidden="true">
        {language === "vi" ? "🇻🇳" : "🇬🇧"}
      </span>
      <span className="lang-code">{language.toUpperCase()}</span>
    </button>
  );
}
