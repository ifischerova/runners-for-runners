import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="section-container max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-4xl"></span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
          Můj profil
        </h1>
        <p className="text-dark-600">Vítej zpět, {user.username}!</p>
      </div>

      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center">
          <span className="text-2xl mr-2"></span>
          Základní informace
        </h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 block">Uživatelské jméno</span>
              <span className="font-semibold text-dark-800">{user.username}</span>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 block">Email</span>
              <span className="font-semibold text-dark-800">{user.email}</span>
            </div>
          </div>
          {user.firstName && (
            <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
              <span className="text-2xl mr-4"></span>
              <div className="flex-1">
                <span className="text-sm text-dark-600 block">Jméno</span>
                <span className="font-semibold text-dark-800">{user.firstName} {user.lastName}</span>
              </div>
            </div>
          )}
          {user.city && (
            <div className="flex items-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
              <span className="text-2xl mr-4"></span>
              <div className="flex-1">
                <span className="text-sm text-dark-600 block">Město</span>
                <span className="font-semibold text-dark-800">{user.city}</span>
              </div>
            </div>
          )}
          <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <span className="text-2xl mr-4"></span>
            <div className="flex-1">
              <span className="text-sm text-dark-600 block">Role</span>
              <span className="font-semibold text-dark-800">{user.roles.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center">
          <span className="text-2xl mr-2"></span>
          Moje jízdy
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4"></div>
          <p className="text-dark-600 text-lg mb-2">Zde se budou zobrazovat vaše vytvořené a rezervované jízdy.</p>
          <p className="text-sm text-dark-500">Tato funkce bude dostupná v další verzi aplikace.</p>
        </div>
      </div>
    </div>
  );
};
