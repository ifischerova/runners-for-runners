import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { Role } from '../types';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user.roles.includes(Role.ADMIN);

  return (
    <div className="section-container max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-4xl"></span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2 leading-tight pb-[5px]">
          {t('profile.title')}
        </h1>
        <p className="text-dark-600 dark:text-dark-300">{t('profile.welcome', { name: user.username })}</p>
      </div>

      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-50 mb-6 flex items-center">
          <span className="text-2xl mr-2"></span>
          {t('profile.basicInfo')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 dark:text-dark-300 block">{t('profile.username')}</span>
              <span className="font-semibold text-dark-800 dark:text-dark-50">{user.username}</span>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 dark:text-dark-300 block">{t('profile.email')}</span>
              <span className="font-semibold text-dark-800 dark:text-dark-50">{user.email}</span>
            </div>
          </div>
          {user.firstName && (
            <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
              <span className="text-2xl mr-4"></span>
              <div className="flex-1">
                <span className="text-sm text-dark-600 dark:text-dark-300 block">{t('profile.name')}</span>
                <span className="font-semibold text-dark-800 dark:text-dark-50">{user.firstName} {user.lastName}</span>
              </div>
            </div>
          )}
          {user.city && (
            <div className="flex items-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-xl">
              <span className="text-2xl mr-4"></span>
              <div className="flex-1">
                <span className="text-sm text-dark-600 dark:text-dark-300 block">{t('profile.city')}</span>
                <span className="font-semibold text-dark-800 dark:text-dark-50">{user.city}</span>
              </div>
            </div>
          )}
          <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 dark:text-dark-300 block">{t('profile.role')}</span>
              <span className="font-semibold text-dark-800 dark:text-dark-50">{isAdmin ? t('profile.role.admin') : t('profile.role.user')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-50 mb-6 flex items-center">
          <span className="text-2xl mr-2"></span>
          {t('profile.rides.title')}
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4"></div>
          <p className="text-dark-600 dark:text-dark-300 text-lg mb-2">{t('profile.rides.placeholder1')}</p>
          <p className="text-sm text-dark-500 dark:text-dark-400">{t('profile.rides.placeholder2')}</p>
        </div>
      </div>
    </div>
  );
};
