import React from 'react';
import { ArrowDown, ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';
import { HERO_IMAGE, BRAND_LOGO } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
        {/* Split Campaign Focal Point */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-black p-0.5 border border-stone-800 shrink-0">
                <img src={BRAND_LOGO} alt="OMED Emblem" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-medium">
                <span>Édition Tunisienne</span>
                <span aria-hidden="true">·</span>
                <span>2026</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-display leading-[1.15]" style={{ textWrap: 'balance' }}>
              L'Élégance Pure au Quotidien
            </h1>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-lg">
              OMED crée des textiles d'exception, des confections en lin et laine mérinos, des toiles denses et des pièces nobles conçues pour traverser le temps. Savoir-faire artisanal tunisien et confection contemporaine.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm"
              >
                <span>Découvrir la Collection</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <a
                href="#philosophy"
                className="text-xs uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors py-3 px-2 underline decoration-stone-300 underline-offset-4"
              >
                Notre Savoir-Faire
              </a>
            </div>
          </div>

          {/* Right Campaign Imagery Column */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-lg">
              <img
                src={HERO_IMAGE}
                alt="OMED univers textile tunisien"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Row (Adjacency Rule - Localized for Tunisia) */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-600 dark:text-stone-400 text-xs">
          <div className="flex items-start gap-3">
            <Truck className="w-4 h-4 text-stone-900 dark:text-stone-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Livraison Rapide</p>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Sur toute la Tunisie</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-4 h-4 text-stone-900 dark:text-stone-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Paiement à la Livraison</p>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Réglez en espèces à la réception</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-stone-900 dark:text-stone-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Matières Nobles</p>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Lin pur de Mahdia, laine mérinos & coton peigné</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-stone-900 dark:text-stone-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Marque Déposée</p>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Série numérotée et certifiée OMED®</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
