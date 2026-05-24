import { Target, Users, Sparkles, Calendar, Car, Search, Handshake, Sprout, PiggyBank, Heart } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="section-container animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl/tight font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4 leading-tight pb-[5px]">
          O projektu Běžci sobě
        </h1>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Spojujeme běžeckou komunitu na cestě za společnými cíli
        </p>
      </div>
      
      <section className="card-modern p-8 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-4">
            <Target size={24} strokeWidth={1.5} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-dark-800">Vize</h2>
        </div>
        <p className="text-dark-700 leading-relaxed text-lg">
          Naší vizí je vytvořit platformu, která propojí běžeckou komunitu nejen na startu závodu, 
          ale už na cestě k němu. Věříme, že sdílená doprava je budoucností udržitelné mobility 
          a že společná cesta může být stejně inspirativní jako samotný závod.
        </p>
      </section>

      <section className="card-modern p-8 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mr-4">
            <Users size={24} strokeWidth={1.5} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-dark-800">Kdo jsme</h2>
        </div>
        <p className="text-dark-700 leading-relaxed text-lg">
          Jsme tým nadšenců pro běh a udržitelný životní styl. Sami jsme běžci, kteří pravidelně 
          objíždíme závody po celé republice. Mnohokrát jsme zažili situaci, kdy jsme jeli sami 
          autem stovky kilometrů, zatímco ostatní běžci jeli stejným směrem. To nás inspirovalo 
          k vytvoření této platformy.
        </p>
      </section>

      <section className="glass-card p-8 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
            <Sparkles size={24} strokeWidth={1.5} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-dark-800">Co nabízíme</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <Calendar size={24} strokeWidth={1.5} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Kalendář závodů</h3>
              <p className="text-sm text-dark-600">Přehledný kalendář běžeckých závodů v ČR</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <Car size={24} strokeWidth={1.5} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Nabídka míst</h3>
              <p className="text-sm text-dark-600">Možnost nabídnout volná místa ve svém autě</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <Search size={24} strokeWidth={1.5} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Hledání spolujízdy</h3>
              <p className="text-sm text-dark-600">Možnost hledat spolujízdu na konkrétní závod</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <Handshake size={24} strokeWidth={1.5} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Spojení běžců</h3>
              <p className="text-sm text-dark-600">Spojení s ostatními běžci s podobnými cíli</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <Sprout size={24} strokeWidth={1.5} className="text-accent-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Ekologie</h3>
              <p className="text-sm text-dark-600">Příspěvek k ochraně životního prostředí</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/50 rounded-xl p-4">
            <PiggyBank size={24} strokeWidth={1.5} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-800">Úspora nákladů</h3>
              <p className="text-sm text-dark-600">Úspora nákladů na dopravu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-modern p-8 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mr-4">
            <Heart size={24} strokeWidth={1.5} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-dark-800">Naše hodnoty</h2>
        </div>
        <div className="space-y-6">
          <div className="feature-card">
            <h3 className="text-xl font-bold text-dark-800 mb-2 flex items-center">
              <span className="text-2xl mr-3"></span>
              Udržitelnost
            </h3>
            <p className="text-dark-700 leading-relaxed">
              Věříme v odpovědný přístup k planetě. Každá sdílená jízda znamená méně emisí a čistší budoucnost.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="text-xl font-bold text-dark-800 mb-2 flex items-center">
              <span className="text-2xl mr-3"></span>
              Komunita
            </h3>
            <p className="text-dark-700 leading-relaxed">
              Běžecká komunita je silná. Chceme ji posilovat nejen na trati, ale i mimo ni.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="text-xl font-bold text-dark-800 mb-2 flex items-center">
              <span className="text-2xl mr-3"></span>
              Podpora
            </h3>
            <p className="text-dark-700 leading-relaxed">
              Podporujeme každého běžce bez ohledu na úroveň. Ať už běžíte maraton nebo první pětku, jste tu vítáni.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
