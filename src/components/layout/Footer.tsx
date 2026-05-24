import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-card border-t border-white/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bottom Bar */}
        <div className="text-center">
          <p className="text-sm text-dark-600 inline-flex items-center gap-1">
            {currentYear} © Made with
            <Heart size={14} strokeWidth={1.5} className="text-red-500 animate-pulse" />
            by <span className="font-semibold text-primary-600">Iva Fischerová</span>
          </p>
          <p className="text-xs text-dark-500 mt-2">
            Běžíme s tebou na každém kroku
          </p>
        </div>
      </div>
    </footer>
  );
};
