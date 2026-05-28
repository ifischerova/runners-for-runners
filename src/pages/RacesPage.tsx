import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Race, Ride, RideType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Select } from '../components/ui/Select';
import { useTranslation } from '../contexts/LanguageContext';

export const RacesPage = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t, formatDate } = useTranslation();

  const [newRide, setNewRide] = useState({
    type: RideType.OFFER,
    from: '',
    to: '',
    car: '',
    availableSeats: 1,
    notes: '',
  });

  useEffect(() => {
    const loadRaces = async () => {
      const loadedRaces = await apiService.getRaces();
      setRaces(loadedRaces);
    };
    loadRaces();
  }, []);

  useEffect(() => {
    const loadRides = async () => {
      if (selectedRace) {
        const loadedRides = await apiService.getRidesByRace(selectedRace);
        setRides(loadedRides);
      } else {
        setRides([]);
      }
    };
    loadRides();
  }, [selectedRace]);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRace(raceId);
    setShowCreateForm(false);
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert(t('races.alert.loginToCreate'));
      navigate('/login');
      return;
    }

    if (!selectedRace) {
      alert(t('races.alert.pickRaceFirst'));
      return;
    }

    try {
      await apiService.createRide({
        raceId: selectedRace,
        type: newRide.type,
        from: newRide.from,
        to: newRide.type === RideType.OFFER ? newRide.to : undefined,
        car: newRide.type === RideType.OFFER ? newRide.car : undefined,
        availableSeats: newRide.availableSeats,
        notes: newRide.notes,
      });

      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);

      setNewRide({
        type: RideType.OFFER,
        from: '',
        to: '',
        car: '',
        availableSeats: 1,
        notes: '',
      });
      setShowCreateForm(false);
      alert(t('races.alert.createSuccess'));
    } catch {
      alert(t('races.alert.createError'));
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!window.confirm(t('races.alert.deleteConfirm'))) {
      return;
    }

    try {
      await apiService.deleteRide(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert(t('races.alert.deleteSuccess'));
    } catch {
      alert(t('races.alert.deleteError'));
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!isAuthenticated || !user) {
      alert(t('races.alert.loginToAccept'));
      navigate('/login');
      return;
    }

    try {
      await apiService.acceptRide(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert(t('races.alert.acceptSuccess'));
    } catch (error) {
      alert(error instanceof Error ? error.message : t('races.alert.acceptError'));
    }
  };

  const handleCancelAcceptance = async (rideId: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!window.confirm(t('races.alert.cancelConfirm'))) {
      return;
    }

    try {
      await apiService.cancelRideAcceptance(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert(t('races.alert.cancelSuccess'));
    } catch (error) {
      alert(error instanceof Error ? error.message : t('races.alert.cancelError'));
    }
  };

  const selectedRaceData = races.find(r => r.id === selectedRace);

  return (
    <div className="section-container animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl/tight font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3 leading-tight pb-[5px]">
          {t('races.hero.title')}
        </h1>
        <p className="text-lg text-dark-600 dark:text-dark-300">
          {t('races.hero.subtitle')}
        </p>
      </div>

      {/* Race Selector Card */}
      <div className="glass-card p-6 mb-8 max-w-3xl mx-auto">
        <label className="block text-lg font-bold text-dark-800 dark:text-dark-50 mb-3">
          {t('races.picker.label')}
        </label>
        <Select
          value={selectedRace}
          onChange={handleRaceSelect}
          searchable
          searchPlaceholder={t('races.picker.search')}
          placeholder={t('races.picker.placeholder')}
          emptyLabel={t('races.picker.empty')}
          options={races.map((race) => ({
            value: race.id,
            label: `${formatDate(race.date)} – ${race.name} (${race.place})${race.isPast ? ` · ${t('races.past.badge')}` : ''}`,
          }))}
        />
      </div>

      {/* Selected race details */}
      {selectedRaceData && (
        <div className="card-modern p-6 md:p-8 mb-8 max-w-4xl mx-auto animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-bold text-dark-800 dark:text-dark-50">
                  {selectedRaceData.name}
                </h3>
                {selectedRaceData.isPast && (
                  <span className="text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-700 dark:bg-surface-700 dark:text-dark-200 px-2.5 py-1 rounded-full">
                    {t('races.past.badge')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-dark-600 dark:text-dark-300">
                <span>{selectedRaceData.place}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl p-4">
              <div className="text-sm text-primary-700 dark:text-primary-200 font-semibold mb-1">{t('races.detail.date')}</div>
              <div className="text-lg font-bold text-primary-900 dark:text-primary-100">
                {formatDate(selectedRaceData.date)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-xl p-4">
              <div className="text-sm text-accent-700 dark:text-accent-200 font-semibold mb-1">{t('races.detail.startTime')}</div>
              <div className="text-lg font-bold text-accent-900 dark:text-accent-100">
                {selectedRaceData.startTime}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4">
              <div className="text-sm text-yellow-700 dark:text-yellow-200 font-semibold mb-1">{t('races.detail.distance')}</div>
              <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                {selectedRaceData.trackLength.name}
              </div>
            </div>
          </div>

          {selectedRaceData.web && (
            <div className="mt-4">
              <a
                href={selectedRaceData.web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 font-semibold"
              >
                {t('races.detail.web')}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Rides list */}
      {selectedRace && (
        <div className="card-modern p-6 md:p-8 mb-8 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-dark-800 dark:text-dark-50">
              {t('races.rides.title')}
            </h3>
            {isAuthenticated && !selectedRaceData?.isPast && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className={`${
                  showCreateForm
                    ? 'btn-outline-custom'
                    : 'btn-accent-custom'
                } whitespace-nowrap`}
              >
                {showCreateForm ? t('common.cancel') : t('races.rides.addBtn')}
              </button>
            )}
            {isAuthenticated && selectedRaceData?.isPast && (
              <span className="text-sm text-dark-500 dark:text-dark-400 italic whitespace-nowrap">
                {t('races.past.addRideDisabled')}
              </span>
            )}
          </div>

          {/* Create ride form */}
          {showCreateForm && (
            <form onSubmit={handleCreateRide} className="glass-card p-6 mb-6 animate-slide-down">
              <h4 className="text-xl font-bold text-dark-800 dark:text-dark-50 mb-4">{t('races.form.title')}</h4>
              <div className="space-y-4">
                <div>
                  <label className="form-label-custom">{t('races.form.type')}</label>
                  <Select
                    value={newRide.type}
                    onChange={(v) => setNewRide({ ...newRide, type: v as RideType })}
                    options={[
                      { value: RideType.OFFER, label: t('races.form.type.offer') },
                      { value: RideType.REQUEST, label: t('races.form.type.request') },
                    ]}
                  />
                </div>

                <div>
                  <label className="form-label-custom">{t('races.form.from.label')}</label>
                  <input
                    type="text"
                    value={newRide.from}
                    onChange={(e) => setNewRide({ ...newRide, from: e.target.value })}
                    className="form-input-custom"
                    placeholder={t('races.form.from.placeholder')}
                    required
                  />
                </div>

                {newRide.type === RideType.OFFER && (
                  <>
                    <div>
                      <label className="form-label-custom">{t('races.form.to.label')}</label>
                      <input
                        type="text"
                        value={newRide.to}
                        onChange={(e) => setNewRide({ ...newRide, to: e.target.value })}
                        className="form-input-custom"
                        placeholder={t('races.form.to.placeholder')}
                      />
                    </div>

                    <div>
                      <label className="form-label-custom">{t('races.form.car.label')}</label>
                      <input
                        type="text"
                        value={newRide.car}
                        onChange={(e) => setNewRide({ ...newRide, car: e.target.value })}
                        className="form-input-custom"
                        placeholder={t('races.form.car.placeholder')}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="form-label-custom">{t('races.form.seats.label')}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNewRide({ ...newRide, availableSeats: n })}
                        className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                          newRide.availableSeats === n
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 dark:border-primary-400'
                            : 'border-gray-200 hover:border-primary-300 dark:border-surface-700 dark:text-dark-200 dark:hover:border-primary-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label-custom">{t('races.form.notes.label')}</label>
                  <textarea
                    value={newRide.notes}
                    onChange={(e) => setNewRide({ ...newRide, notes: e.target.value })}
                    className="form-input-custom"
                    rows={3}
                    placeholder={t('races.form.notes.placeholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-full"
                >
                  {t('races.form.submit')}
                </button>
              </div>
            </form>
          )}

          {/* Rides cards */}
          {rides.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className={`card-modern p-5 ${
                    ride.type === RideType.OFFER
                      ? 'border-l-4 border-accent-500'
                      : 'border-l-4 border-primary-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ride.type === RideType.OFFER
                        ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                    }`}>
                      {ride.type === RideType.OFFER ? t('races.card.type.offer') : t('races.card.type.request')}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-dark-600 dark:text-dark-300">{t('races.card.seats')}</div>
                      <div className="text-xl font-bold text-dark-800 dark:text-dark-50">
                        {ride.availableSeats - ride.occupiedSeats}/{ride.availableSeats}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-dark-700 dark:text-dark-200">
                      <span className="font-semibold">{t('races.card.from')}</span>
                      <span className="ml-2">{ride.from}</span>
                    </div>
                    {ride.to && (
                      <div className="flex items-center text-dark-700 dark:text-dark-200">
                        <span className="font-semibold">{t('races.card.to')}</span>
                        <span className="ml-2">{ride.to}</span>
                      </div>
                    )}
                    {ride.car && (
                      <div className="flex items-center text-dark-600 dark:text-dark-300 text-sm">
                        <span>{ride.car}</span>
                      </div>
                    )}
                  </div>

                  {ride.notes && (
                    <p className="text-sm text-dark-600 dark:text-dark-300 bg-gray-50 dark:bg-surface-850 rounded-lg p-3 mb-3">
                      {ride.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-surface-700">
                    <div className="text-sm text-dark-600 dark:text-dark-300">
                      {t('races.card.user')} <span className="font-semibold">
                        {ride.userFirstName && ride.userLastName
                          ? `${ride.userFirstName} ${ride.userLastName}`
                          : ride.userUsername}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isAuthenticated && ride.userId === user?.id && (
                        <button
                          onClick={() => handleDeleteRide(ride.id)}
                          className="text-sm font-semibold text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                      )}
                      {isAuthenticated && ride.userId !== user?.id && ride.type === RideType.OFFER && (
                        <>
                          {ride.passengers.includes(user?.id || '') ? (
                            <button
                              onClick={() => handleCancelAcceptance(ride.id)}
                              className="text-sm font-semibold text-yellow-600 dark:text-yellow-300 hover:text-yellow-700 dark:hover:text-yellow-200 px-3 py-1 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/40 transition-colors"
                            >
                              {t('races.card.cancelAcceptance')}
                            </button>
                          ) : ride.racePast ? (
                            <span className="text-sm text-gray-400 dark:text-dark-400 italic" title={t('races.past.addRideDisabled')}>
                              {t('races.past.acceptDisabled')}
                            </span>
                          ) : ride.availableSeats > ride.occupiedSeats ? (
                            <button
                              onClick={() => handleAcceptRide(ride.id)}
                              className="text-sm font-semibold text-accent-600 dark:text-accent-300 hover:text-accent-700 dark:hover:text-accent-200 px-3 py-1 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900/40 transition-colors"
                            >
                              {t('races.card.accept')}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-dark-400 italic">{t('races.card.full')}</span>
                          )}
                        </>
                      )}
                      {isAuthenticated && ride.userId !== user?.id && ride.type === RideType.REQUEST && (
                        <button
                          className="text-sm font-semibold text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors"
                        >
                          {t('common.contact')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-dark-600 dark:text-dark-300 mb-2">{t('races.rides.empty.title')}</p>
              <p className="text-dark-500 dark:text-dark-400">{t('races.rides.empty.subtitle')}</p>
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && selectedRace && (
        <div className="glass-card p-6 text-center max-w-2xl mx-auto border-2 border-accent-300 dark:border-accent-800 animate-scale-in">
          <h3 className="text-xl font-bold text-dark-800 dark:text-dark-50 mb-2">
            {t('races.rides.loginPrompt.title')}
          </h3>
          <p className="text-dark-600 dark:text-dark-300 mb-6">
            {t('races.rides.loginPrompt.before')} <span className="font-bold">{t('races.rides.loginPrompt.linkText')}</span>.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-accent-custom"
          >
            {t('races.rides.loginPrompt.cta')}
          </button>
        </div>
      )}
    </div>
  );
};
