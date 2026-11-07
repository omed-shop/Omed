import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND_LOGO } from '../data/products';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info with Official Logo & Newsletter */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md overflow-hidden bg-black p-0.5 border border-stone-800 shrink-0 shadow-sm">
                <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-[0.25em] uppercase text-stone-900 dark:text-stone-100 block font-display leading-none">
                  OMED
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">
                  Maison Tunisienne de Design
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-stone-500 dark:text-stone-400">
              Créations intemporelles, maroquinerie en cuir tanné végétal, marbre de Thala et luminaires contemporains conçus et façonnés en Tunisie.
            </p>

            <div className="pt-2">
              <span className="block text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200 font-semibold mb-1">
                La Lettre OMED
              </span>
              <p className="text-[11px] text-stone-500 mb-3">
                Soyez informés en avant-première des nouvelles séries limitées et lancements exclusifs.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{subscribed ? 'Inscrit' : 'Rejoindre'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Column 1: Catalog */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 block">
              Collections
            </span>
            <ul className="space-y-2">
              <li><a href="#catalog" className="hover:text-stone-950 dark:hover:text-white transition-colors">Collection Textiles</a></li>
              <li><a href="#catalog" className="hover:text-stone-950 dark:hover:text-white transition-colors">Tricots & Laine Mérinos</a></li>
              <li><a href="#catalog" className="hover:text-stone-950 dark:hover:text-white transition-colors">Plaids & Linge en Lin Pur</a></li>
              <li><a href="#catalog" className="hover:text-stone-950 dark:hover:text-white transition-colors">Toiles & Foutas Artisanales</a></li>
            </ul>
          </div>

          {/* Quick Links Column 2: Atelier & Heritage */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 block">
              Atelier
            </span>
            <ul className="space-y-2">
              <li><a href="#philosophy" className="hover:text-stone-950 dark:hover:text-white transition-colors">Manifeste Textile</a></li>
              <li><a href="#philosophy" className="hover:text-stone-950 dark:hover:text-white transition-colors">Tissage de Ksar Hellal</a></li>
              <li><a href="#philosophy" className="hover:text-stone-950 dark:hover:text-white transition-colors">Lin Naturel de Mahdia</a></li>
              <li><span className="text-stone-400 dark:text-stone-600">Séries Numérotées</span></li>
            </ul>
          </div>

          {/* Quick Links Column 3: Logistics & Tunisia Delivery */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 block">
              Livraison & Service
            </span>
            <ul className="space-y-2">
              <li><span className="text-stone-800 dark:text-stone-200 font-medium">Livraison sur toute la Tunisie (24-48h)</span></li>
              <li><span>Paiement en espèces à la livraison (COD)</span></li>
              <li className="pt-2 text-[11px] text-stone-500 font-mono">
                Ateliers : Tunis · Ksar Hellal · Mahdia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle legal */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-stone-400">
          <div>
            © {new Date().getFullYear()} OMED® Tunisie. Marque déposée. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Conditions Générales</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer">Confidentialité</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-medium underline flex items-center gap-1"
            >
              <span>Espace Privé</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
