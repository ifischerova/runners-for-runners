import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Race, Ride, RideType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Select } from '../components/ui/Select';

export const RacesPage = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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
      alert('Pro vytvoření jízdy se musíte přihlásit');
      navigate('/login');
      return;
    }

    if (!selectedRace) {
      alert('Vyberte prosím závod');
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
      alert('Jízda byla úspěšně vytvořena!');
    } catch {
      alert('Chyba při vytváření jízdy');
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!window.confirm('Opravdu chcete smazat tuto jízdu?')) {
      return;
    }

    try {
      await apiService.deleteRide(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert('Jízda byla úspěšně smazána');
    } catch {
      alert('Chyba při mazání jízdy');
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!isAuthenticated || !user) {
      alert('Pro přijetí nabídky se musíte přihlásit');
      navigate('/login');
      return;
    }

    try {
      await apiService.acceptRide(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert('Úspěšně jste přijali nabídku jízdy!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Chyba při přijímání jízdy');
    }
  };

  const handleCancelAcceptance = async (rideId: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!window.confirm('Opravdu chcete zrušit účast na této jízdě?')) {
      return;
    }

    try {
      await apiService.cancelRideAcceptance(rideId);
      const loadedRides = await apiService.getRidesByRace(selectedRace);
      setRides(loadedRides);
      alert('Účast na jízdě byla zrušena');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Chyba při rušení účasti');
    }
  };

  const selectedRaceData = races.find(r => r.id === selectedRace);

  return (
    <div className="section-container animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl/tight font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3 leading-tight pb-[5px]">
          Běhej dál - dojeď rychleji!
        </h1>
        <p className="text-lg text-dark-600">
          Najdi spolujízdu na svůj oblíbený závod a šetři přírodu i peněženku
        </p>
      </div>

      {/* Race Selector Card */}
      <div className="glass-card p-6 mb-8 max-w-3xl mx-auto">
        <label className="block text-lg font-bold text-dark-800 mb-3">
          Zvol termín závodu
        </label>
        <Select
          value={selectedRace}
          onChange={handleRaceSelect}
          searchable
          searchPlaceholder="Hledat závod podle názvu nebo místa..."
          placeholder="Vyberte závod"
          emptyLabel="Žádný závod neodpovídá hledání"
          options={races.map((race) => ({
            value: race.id,
            label: `${new Date(race.date).toLocaleDateString('cs-CZ')} – ${race.name} (${race.place})`,
          }))}
        />
      </div>

      {/* Selected race details */}
      {selectedRaceData && (
        <div className="card-modern p-6 md:p-8 mb-8 max-w-4xl mx-auto animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-dark-800 mb-2">
                {selectedRaceData.name}
              </h3>
              <div className="flex items-center space-x-2 text-dark-600">
                <span>{selectedRaceData.place}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
              <div className="text-sm text-primary-700 font-semibold mb-1">Datum</div>
              <div className="text-lg font-bold text-primary-900">
                {new Date(selectedRaceData.date).toLocaleDateString('cs-CZ', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-4">
              <div className="text-sm text-accent-700 font-semibold mb-1">Start závodu</div>
              <div className="text-lg font-bold text-accent-900">
                {selectedRaceData.startTime}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="text-sm text-yellow-700 font-semibold mb-1">Délka trati</div>
              <div className="text-lg font-bold text-yellow-900">
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
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
              >
                Navštívit web závodu
                <span className="ml-1">→</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Rides list */}
      {selectedRace && (
        <div className="card-modern p-6 md:p-8 mb-8 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-2xl font-bold text-dark-800">
              Dostupné jízdy
            </h3>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className={`${
                  showCreateForm
                    ? 'btn-outline-custom'
                    : 'btn-accent-custom'
                } whitespace-nowrap`}
              >
                {showCreateForm ? 'Zrušit' : '+ Přidat jízdu'}
              </button>
            )}
          </div>

          {/* Create ride form */}
          {showCreateForm && (
            <form onSubmit={handleCreateRide} className="glass-card p-6 mb-6 animate-slide-down">
              <h4 className="text-xl font-bold text-dark-800 mb-4">Vytvořit novou jízdu</h4>
              <div className="space-y-4">
                <div>
                  <label className="form-label-custom">Typ jízdy</label>
                  <Select
                    value={newRide.type}
                    onChange={(v) => setNewRide({ ...newRide, type: v as RideType })}
                    options={[
                      { value: RideType.OFFER, label: 'Nabídka (nabízím místo)' },
                      { value: RideType.REQUEST, label: 'Poptávka (hledám jízdu)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="form-label-custom">Odkud jedeš? *</label>
                  <input
                    type="text"
                    value={newRide.from}
                    onChange={(e) => setNewRide({ ...newRide, from: e.target.value })}
                    className="form-input-custom"
                    placeholder="Např. Praha"
                    required
                  />
                </div>

                {newRide.type === RideType.OFFER && (
                  <>
                    <div>
                      <label className="form-label-custom">Kam jedeš zpět? (volitelné)</label>
                      <input
                        type="text"
                        value={newRide.to}
                        onChange={(e) => setNewRide({ ...newRide, to: e.target.value })}
                        className="form-input-custom"
                        placeholder="Např. Brno"
                      />
                    </div>

                    <div>
                      <label className="form-label-custom">Typ auta</label>
                      <input
                        type="text"
                        value={newRide.car}
                        onChange={(e) => setNewRide({ ...newRide, car: e.target.value })}
                        className="form-input-custom"
                        placeholder="Např. Škoda Octavia"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="form-label-custom">Počet volných míst</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNewRide({ ...newRide, availableSeats: n })}
                        className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                          newRide.availableSeats === n
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label-custom">Poznámka (volitelná)</label>
                  <textarea
                    value={newRide.notes}
                    onChange={(e) => setNewRide({ ...newRide, notes: e.target.value })}
                    className="form-input-custom"
                    rows={3}
                    placeholder="Přidej další informace, např. čas odjezdu, místo srazu..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-full"
                >
                  Vytvořit jízdu
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
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}>
                      {ride.type === RideType.OFFER ? 'Nabídka' : 'Poptávka'}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-dark-600">Volná místa</div>
                      <div className="text-xl font-bold text-dark-800">
                        {ride.availableSeats - ride.occupiedSeats}/{ride.availableSeats}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-dark-700">
                      <span className="font-semibold">Z:</span>
                      <span className="ml-2">{ride.from}</span>
                    </div>
                    {ride.to && (
                      <div className="flex items-center text-dark-700">
                        <span className="font-semibold">Do:</span>
                        <span className="ml-2">{ride.to}</span>
                      </div>
                    )}
                    {ride.car && (
                      <div className="flex items-center text-dark-600 text-sm">
                        <span>{ride.car}</span>
                      </div>
                    )}
                  </div>

                  {ride.notes && (
                    <p className="text-sm text-dark-600 bg-gray-50 rounded-lg p-3 mb-3">
                      {ride.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-dark-600">
                      Uživatel: <span className="font-semibold">
                        {ride.userFirstName && ride.userLastName
                          ? `${ride.userFirstName} ${ride.userLastName}`
                          : ride.userUsername}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isAuthenticated && ride.userId === user?.id && (
                        <button
                          onClick={() => handleDeleteRide(ride.id)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Smazat
                        </button>
                      )}
                      {isAuthenticated && ride.userId !== user?.id && ride.type === RideType.OFFER && (
                        <>
                          {ride.passengers.includes(user?.id || '') ? (
                            <button
                              onClick={() => handleCancelAcceptance(ride.id)}
                              className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-50 transition-colors"
                            >
                              Zrušit účast
                            </button>
                          ) : ride.availableSeats > ride.occupiedSeats ? (
                            <button
                              onClick={() => handleAcceptRide(ride.id)}
                              className="text-sm font-semibold text-accent-600 hover:text-accent-700 px-3 py-1 rounded-lg hover:bg-accent-50 transition-colors"
                            >
                              Přijmout nabídku
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Obsazeno</span>
                          )}
                        </>
                      )}
                      {isAuthenticated && ride.userId !== user?.id && ride.type === RideType.REQUEST && (
                        <button
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          Kontaktovat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-dark-600 mb-2">Zatím nejsou k dispozici žádné jízdy</p>
              <p className="text-dark-500">Buď první, kdo nabídne nebo poptá spolujízdu!</p>
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && selectedRace && (
        <div className="glass-card p-6 text-center max-w-2xl mx-auto border-2 border-accent-300 animate-scale-in">
          <h3 className="text-xl font-bold text-dark-800 mb-2">
            Přihlas se a jdi do toho!
          </h3>
          <p className="text-dark-600 mb-6">
            Pro přidání nebo rezervaci jízdy se musíte <span className="font-bold">přihlásit</span>.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-accent-custom"
          >
            Přihlásit se →
          </button>
        </div>
      )}
    </div>
  );
};
