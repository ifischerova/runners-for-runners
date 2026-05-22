import { User } from '@/types';
import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Client-side validation
    if (!email) {
      setError('Vyplňte prosím email');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Zadejte prosím platnou emailovou adresu');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user exists (mock check using localStorage)
      const users: Array<User> = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((user: User) => user.email === email);
      
      if (!userExists) {
        setError('Uživatel s tímto emailem nebyl nalezen');
        setIsLoading(false);
        return;
      }

      // In a real app, this would send a password reset email
      // For now, just show success message
      setIsSubmitted(true);
    } catch {
      setError('Něco se pokazilo. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="section-container max-w-md mx-auto animate-fade-in">
        <div className="glass-card p-8 text-center animate-scale-in">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-dark-800 mb-4">Email odeslán!</h2>
          <p className="text-dark-600 mb-6 leading-relaxed">
            Pokud je email <span className="font-semibold text-primary-600">{email}</span> registrován v našem systému, 
            obdržíte instrukce pro obnovení hesla.
          </p>
          <p className="text-sm text-dark-500 mb-6">
            Zkontrolujte prosím svou emailovou schránku (i složku spam).
          </p>
          <Link 
            to="/login" 
            className="btn-primary-custom inline-block"
          >
            Zpět na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-slow">
          <span className="text-3xl">🔑</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3 leading-tight">
          Zapomenuté heslo
        </h1>
        <p className="text-dark-600">Zadejte svůj email a my vám pošleme instrukce pro obnovení hesla</p>
      </div>

      <div className="glass-card p-8 animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl animate-slide-down">
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="form-label-custom">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input-custom"
              required
              autoComplete="email"
              placeholder="tvuj@email.cz"
              disabled={isLoading}
            />
            <p className="text-xs text-dark-500 mt-2">
              Zadejte email, který jste použili při registraci
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary-custom disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Odesílám...' : 'Odeslat instrukce'}
          </button>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-center text-sm text-dark-600">
              Vzpomněli jste si na heslo?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                Přihlaste se
              </Link>
            </p>

            <p className="text-center text-sm text-dark-600">
              Ještě nemáte účet?{' '}
              <Link to="/registration" className="text-accent-600 hover:text-accent-700 font-bold">
                Zaregistrujte se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
