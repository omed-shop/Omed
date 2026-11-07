import React from 'react';
import { Compass, Hammer, Sparkles } from 'lucide-react';
import { BRAND_LOGO } from '../data/products';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 w-6 rounded bg-black p-0.5 border border-stone-800 shrink-0">
              <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-medium">
              <span>Manifeste OMED</span>
              <span aria-hidden="true">·</span>
              <span>Savoir-Faire Tunisien</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-display">
            L'Excellence du Textile & La Mémoire des Tissages
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            Fondée en Tunisie, la Maison OMED perpétue l'héritage des maîtres tisserands et confectionneurs du Sahel et de Tunis. Chaque pièce textile est pensée pour offrir une tenue exceptionnelle, un confort intemporel et une élégance sobre.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Pillar 01 */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100">
              <Hammer className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">01. Fibres Nobles</div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 font-display">
              Lin Lavé, Laine Mérinos & Coton Pur
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Nous sélectionnons exclusivement des fibres naturelles respirantes et résistantes. Le lin pur, le coton peigné de filature et la laine mérinos procurent un toucher soyeux et s'assouplissent naturellement avec le temps.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">02. Sobriété Méditerranéenne</div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 font-display">
              Équilibre, Tombé & Confort
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Des coupes contemporaines épurées, des textures tissées riches et un tombé impeccable. Nos créations s'adaptent harmonieusement à votre quotidien et traversent les modes.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">03. Ateliers Tunisiens</div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 font-display">
              Confection Soignée & Éditions Numérotées
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Confectionnées avec passion dans les ateliers de Tunis, Ksar Hellal, Mahdia et Monastir. Chaque pièce est contrôlée individuellement avant expédition pour garantir un standard de qualité irréprochable OMED®.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
