import { useTranslation } from '../contexts/LanguageContext';

export const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="section-container max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3 leading-tight pb-[5px]">
          {t('terms.title')}
        </h1>
        <p className="text-dark-600">{t('terms.subtitle')}</p>
      </div>

      <div className="glass-card p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section1.title')}
          </h2>
          <p className="text-dark-700 leading-relaxed">
            {t('terms.section1.body')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section2.title')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section2.li1')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section2.li2')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section2.li3')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section2.li4')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section3.title')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section3.li1')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section3.li2')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section3.li3')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section3.li4')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section4.title')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section4.li1')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section4.li2')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section4.li3')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section4.li4')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section5.title')}
          </h2>
          <p className="text-dark-700 leading-relaxed p-4 rounded-lg">
            {t('terms.section5.body')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section6.title')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section6.li1')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section6.li2')}</p>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg">
              <span></span>
              <p className="text-dark-700">{t('terms.section6.li3')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-dark-800 mb-4 flex items-center">
            <span className="text-2xl mr-2"></span>
            {t('terms.section7.title')}
          </h2>
          <p className="text-dark-700 leading-relaxed">
            {t('terms.section7.body')}
          </p>
        </section>

        <section className="pt-4 border-t">
          <p className="text-sm text-gray-600">{t('terms.lastUpdate')}</p>
        </section>
      </div>
    </div>
  );
};
