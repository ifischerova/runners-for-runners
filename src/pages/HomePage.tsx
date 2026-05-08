import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="section-container">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-accent-100 to-primary-100 rounded-full">
          <span className="text-sm font-semibold text-primary-700">Ekologicky • Společně • Úsporně</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent leading-tight">
          Cesta na závod?<br />Sdílej ji s běžci!
        </h1>
        
        <p className="text-xl md:text-2xl text-dark-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Spojujeme běžce na cestě za společnými cíli – ušetříš náklady, čas a planetu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/races" 
            className="btn-primary-custom text-lg px-8 group"
          >
            <span className="inline-flex items-center">
              Prozkoumat závody
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
          <Link 
            to="/about" 
            className="btn-outline-custom text-lg px-8"
          >
            Jak to funguje?
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-16 animate-slide-up">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark-800">
          Proč sdílet cestu?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Ecology Card */}
          <div className="feature-card group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark-800">Ekologie</h3>
            <p className="text-dark-600 leading-relaxed">
              Méně aut na silnici znamená čistší vzduch pro každého. Buď součástí změny!
            </p>
          </div>

          {/* Community Card */}
          <div className="feature-card group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform shadow-lg">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark-800">Komunita</h3>
            <p className="text-dark-600 leading-relaxed">
              Sdílej své nadšení, zkušenosti a energii už po cestě na závod.
            </p>
          </div>

          {/* Savings Card */}
          <div className="feature-card group">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-primary-400 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-6 transition-transform shadow-lg">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-dark-800">Úspora</h3>
            <p className="text-dark-600 leading-relaxed">
              Rozdělte náklady na cestu a získejte víc pro zážitky z běhu.
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-lg text-dark-600 italic max-w-3xl mx-auto">
          Přidej se k běžcům, kteří neřeší jen časy na trati, ale i dopad na svět kolem sebe.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-16 animate-slide-up">
        <div className="glass-card max-w-4xl mx-auto p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-dark-800">
            Jak to funguje?
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-dark-800">Najdi závod</h3>
                <p className="text-dark-600">
                  <Link to="/races" className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-2">
                    Prozkoumej kalendář běžeckých akcí
                  </Link>{' '}
                  a vyber si závod, na který se chceš vydat.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-dark-800">Domluv spolujízdu</h3>
                <p className="text-dark-600">
                  <Link to="/races" className="text-accent-600 hover:text-accent-700 font-semibold underline decoration-2 underline-offset-2">
                    Najdi nebo nabídni volné místo v autě
                  </Link>{' '}
                  a domluv se s ostatními běžci.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-dark-800">Běž a užij si to!</h3>
                <p className="text-dark-600">
                  Cestuj ekologicky, pohodlně a ve skvělé společnosti. Je to jednoduché!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-dark-600 italic mb-6">
              Běžíme s tebou na každém kroku.
            </p>
            <Link to="/registration" className="btn-accent-custom inline-block">
              Začít hned teď
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="glass-card max-w-5xl mx-auto p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="animate-scale-in">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <div className="text-sm text-dark-600">Běžců</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent mb-2">
                250+
              </div>
              <div className="text-sm text-dark-600">Závodů</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-dark-600">Sdílených jízd</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-primary-700 bg-clip-text text-transparent mb-2">
                15t
              </div>
              <div className="text-sm text-dark-600">CO₂ úspor</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-16">
        <div className="glass-card max-w-3xl mx-auto p-10">
          <h2 className="text-3xl font-bold mb-4 text-dark-800">
            Připraveni na další běh?
          </h2>
          <p className="text-lg text-dark-600 mb-8">
            Připoj se ke komunitě běžců, kteří dbají na planetu i své peněženky.
          </p>
          <Link 
            to="/registration" 
            className="btn-primary-custom text-lg inline-block"
          >
            Registrovat se zdarma
          </Link>
        </div>
      </section>
    </div>
  );
};

