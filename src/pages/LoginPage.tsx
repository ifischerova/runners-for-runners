import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Client-side validation
    if (!username || !password) {
      setError('Vyplňte prosím všechna pole');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků');
      setIsLoading(false);
      return;
    }

    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Přihlášení selhalo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-container max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-slow">
          <span className="text-3xl">🏃</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
          Vítej zpět, běžče!
        </h1>
        <p className="text-dark-600">Přihlas se a pokračuj v plánování svých cest na závody</p>
      </div>

      <div className="glass-card p-8 animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl animate-slide-down">
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="form-label-custom">
              Uživatelské jméno
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input-custom"
              required
              autoComplete="username"
              placeholder="Zadej své uživatelské jméno"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label-custom">
              Heslo
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input-custom"
              required
              autoComplete="current-password"
              minLength={6}
              placeholder="Zadej své heslo"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary-custom disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-center text-sm">
              <Link to="/forgotten-password" className="text-primary-600 hover:text-primary-700 font-medium">
                Zapomněl/a jsem heslo
              </Link>
            </p>

            <p className="text-center text-sm text-dark-600">
              Ještě nemáte účet?{' '}
              <Link to="/registration" className="text-accent-600 hover:text-accent-700 font-bold">
                Zaregistrujte se zdarma →
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
