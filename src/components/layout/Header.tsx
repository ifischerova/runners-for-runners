import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { useState } from 'react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/30 animate-slide-down">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {t('common.appName')}
            </span>
          </Link>

          {/* Hamburger menu button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={t('common.menu.toggle')}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-primary-100 transition-colors space-y-1.5"
          >
            <span className={`block h-0.5 w-6 bg-primary-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-primary-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-primary-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-2 items-center">
            <li>
              <Link to="/about" className="px-4 py-2 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-all duration-200">
                {t('common.nav.about')}
              </Link>
            </li>
            <li>
              <Link to="/races" className="px-4 py-2 rounded-lg text-dark-700 hover:bg-accent-50 hover:text-accent-600 font-medium transition-all duration-200">
                {t('common.nav.races')}
              </Link>
            </li>
            <li>
              <Link to="/organizers" className="px-4 py-2 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-all duration-200">
                {t('common.nav.organizers')}
              </Link>
            </li>
            <li>
              <LanguageSwitcher className="ml-1 mr-2" />
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200">
                    {user?.username}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-dark-700 hover:bg-red-50 hover:text-red-600 font-medium transition-all duration-200"
                  >
                    {t('common.logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/registration" className="px-4 py-2 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-all duration-200">
                    {t('common.register')}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium shadow-md hover:shadow-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-200">
                    {t('common.login')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-20 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={closeMenu}>
            <ul className="glass-card rounded-2xl mx-4 mt-2 p-4 flex flex-col space-y-2 shadow-xl animate-slide-down" onClick={(e) => e.stopPropagation()}>
              <li className="flex justify-center pb-2 border-b border-gray-100">
                <LanguageSwitcher />
              </li>
              <li>
                <Link to="/about" onClick={closeMenu} className="block py-3 px-4 hover:bg-primary-50 rounded-xl text-dark-700 font-medium transition-all">
                  {t('common.nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/races" onClick={closeMenu} className="block py-3 px-4 hover:bg-accent-50 rounded-xl text-dark-700 font-medium transition-all">
                  {t('common.nav.races')}
                </Link>
              </li>
              <li>
                <Link to="/organizers" onClick={closeMenu} className="block py-3 px-4 hover:bg-primary-50 rounded-xl text-dark-700 font-medium transition-all">
                  {t('common.nav.organizers')}
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profile" onClick={closeMenu} className="block py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium">
                      {t('common.nav.profileWithName', { name: user?.username ?? '' })}
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block py-3 px-4 hover:bg-red-50 rounded-xl text-dark-700 font-medium text-left w-full transition-all">
                      {t('common.logout.long')}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/registration" onClick={closeMenu} className="block py-3 px-4 hover:bg-primary-50 rounded-xl text-dark-700 font-medium transition-all">
                      {t('common.register')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" onClick={closeMenu} className="block py-3 px-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium">
                      {t('common.login')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
