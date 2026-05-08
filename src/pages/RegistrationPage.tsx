import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Uživatelské jméno je povinné';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Uživatelské jméno musí mít alespoň 3 znaky';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'Uživatelské jméno může obsahovat pouze písmena, čísla, tečky, pomlčky a podtržítka';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email je povinný';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Heslo je povinné';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Heslo musí mít alespoň 6 znaků';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Heslo musí obsahovat velké a malé písmeno nebo číslo';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potvrďte heslo';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hesla se neshodují';
    }

    // Terms validation
    if (!formData.acceptedTerms) {
      newErrors.terms = 'Musíte přijmout podmínky použití';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert('Registrace byla úspěšná! Nyní se můžete přihlásit.');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Registrace selhala' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="section-container max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-slow">
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-3">
          Staň se jedním z nás!
        </h1>
        <p className="text-dark-600">Registruj se zdarma a začni sdílet cesty s běžeckou komunitou</p>
      </div>

      <div className="glass-card p-8 animate-scale-in">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl animate-slide-down">
              <span>{errors.general}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="form-label-custom">
              Uživatelské jméno *
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`form-input-custom ${errors.username ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              required
              autoComplete="username"
              placeholder="Např. jirka_runner"
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="form-label-custom">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`form-input-custom ${errors.email ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              required
              autoComplete="email"
              placeholder="tvuj@email.cz"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label-custom">
              Heslo *
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`form-input-custom ${errors.password ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              required
              autoComplete="new-password"
              minLength={6}
              placeholder="Minimálně 6 znaků"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label-custom">
              Potvrzení hesla *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`form-input-custom ${errors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              required
              autoComplete="new-password"
              placeholder="Zadej heslo znovu"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => handleChange('acceptedTerms', e.target.checked)}
                className="mt-1 mr-3 w-4 h-4 accent-primary-600"
                required
              />
              <label htmlFor="terms" className="text-sm text-dark-700">
                Souhlasím s{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                  podmínkami použití
                </Link>
                {' '}*
              </label>
            </div>
            {errors.terms && <p className="text-red-600 text-sm mt-2">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent-custom disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registruji...' : 'Vytvořit účet'}
          </button>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-sm text-dark-600">
              Už máte účet?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                Přihlaste se →
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
