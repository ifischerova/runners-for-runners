export const OrganizersPage = () => {
  return (
    <div className="section-container animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-block w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-slow">
          <span className="text-3xl">🏆</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-4 leading-tight">
          Pro pořadatele závodů
        </h1>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Staňte se součástí zelené běžecké revoluce
        </p>
      </div>

      <section className="glass-card p-8 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-800 mb-4">Přidejte se k nám!</h2>
        <p className="text-dark-700 leading-relaxed text-lg">
          Jste pořadatelem běžeckých závodů a chcete své akce posunout na novou úroveň udržitelnosti? 
          Máme pro vás skvělou příležitost!
        </p>
      </section>

      <section className="card-modern p-8 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-800 mb-6">Co nabízíme pořadatelům</h2>
        <div className="space-y-4">
          <div className="feature-card">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📣</span>
              <div>
                <h3 className="font-bold text-lg text-dark-800 mb-1">Propagaci vašeho závodu</h3>
                <p className="text-dark-600">
                  Vaše akce budou viditelné tisícům běžců, kteří hledají další závod na svůj kalendář
                </p>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">🌱</span>
              <div>
                <h3 className="font-bold text-lg text-dark-800 mb-1">Ekologický profil</h3>
                <p className="text-dark-600">
                  Ukažte, že vám záleží na životním prostředí a podporujete sdílenou dopravu
                </p>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📈</span>
              <div>
                <h3 className="font-bold text-lg text-dark-800 mb-1">Větší účast</h3>
                <p className="text-dark-600">
                  Běžci, kteří by jinak nemohli dojet na váš závod, díky sdílené dopravě najdou cestu
                </p>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">🤝</span>
              <div>
                <h3 className="font-bold text-lg text-dark-800 mb-1">Komunita</h3>
                <p className="text-dark-600">
                  Podpořte vytváření běžecké komunity už před startem vašeho závodu
                </p>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="font-bold text-lg text-dark-800 mb-1">Statistiky</h3>
                <p className="text-dark-600">
                  Přehled o zájmu o sdílenou dopravu na váš závod
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-800 mb-6">Jak to funguje</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark-800">Registrace</h3>
              <p className="text-dark-600">Zaregistrujte svůj závod na naší platformě</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark-800">Propagace</h3>
              <p className="text-dark-600">Sdílejte informaci o možnosti sdílené dopravy mezi účastníky</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark-800">Monitorování</h3>
              <p className="text-dark-600">Sledujte zájem o váš závod a statistiky sdílené dopravy</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark-800">Udržitelnost</h3>
              <p className="text-dark-600">Staňte se součástí zelené běžecké revoluce</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-modern p-8 max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-dark-800 mb-3">Kontaktujte nás</h2>
          <p className="text-lg text-dark-600 mb-6">Zajímá vás spolupráce? Rádi s vámi probereme možnosti partnerství.</p>
        </div>
        
        <a 
          href="mailto:team@bezcisobe.cz" 
          className="btn-accent-custom inline-block text-lg mb-6"
        >
          Zjistěte více a zapojte se
        </a>
        
        <p className="text-dark-600 leading-relaxed">
          Pomozte nám posouvat běžecké závody blíž k udržitelné budoucnosti – staňte se součástí našeho projektu ještě dnes.
        </p>
      </section>
    </div>
  );
};
