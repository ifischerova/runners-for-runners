import { useTranslation } from '../../contexts/LanguageContext';
import { Flag } from './Flag';
import type { Locale } from '../../i18n/translations';

interface LanguageSwitcherProps {
  className?: string;
}

const LOCALES: { code: Locale; labelKey: 'common.languageSwitcher.cs' | 'common.languageSwitcher.en' }[] = [
  { code: 'cs', labelKey: 'common.languageSwitcher.cs' },
  { code: 'en', labelKey: 'common.languageSwitcher.en' },
];

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('common.languageSwitcher.label')}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {LOCALES.map(({ code, labelKey }) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-label={t(labelKey)}
            aria-pressed={isActive}
            className={`flex items-center justify-center w-9 h-7 rounded-md border border-transparent transition-all duration-200 ${
              isActive
                ? 'opacity-100 ring-2 ring-primary-500 ring-offset-1 ring-offset-white/50'
                : 'opacity-50 hover:opacity-100 hover:border-gray-300'
            }`}
          >
            <Flag code={code} size={20} />
          </button>
        );
      })}
    </div>
  );
}
