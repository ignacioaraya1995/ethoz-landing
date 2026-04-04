import { es } from './translations/es';
import { en } from './translations/en';

type TranslationKey = keyof typeof es;
type Locale = 'es' | 'en';

const translations: Record<Locale, Record<string, string>> = { es, en };

let locale = $state<Locale>('es');

export function t(key: TranslationKey): string {
  return translations[locale][key] ?? key;
}

export function setLocale(newLocale: Locale) {
  locale = newLocale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = newLocale;
  }
}

export function getLocale(): Locale {
  return locale;
}

export function toggleLocale() {
  setLocale(locale === 'es' ? 'en' : 'es');
}

export type { Locale, TranslationKey };
