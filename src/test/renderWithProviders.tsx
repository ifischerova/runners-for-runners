import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import type { Locale } from '../i18n/translations';

interface Options {
  withAuth?: boolean;
  locale?: Locale;
}

// Test helper that wraps a component in the same providers the real app uses.
// Default locale is Czech so existing assertions on Czech text keep working in
// jsdom (whose navigator.language is otherwise `en-US`).
export function renderWithProviders(
  ui: ReactNode,
  { withAuth = false, locale = 'cs' }: Options = {}
) {
  window.localStorage.setItem('bezci_locale', locale);
  const tree = withAuth ? (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>{ui}</AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <LanguageProvider>{ui}</LanguageProvider>
    </BrowserRouter>
  );
  return render(tree);
}
