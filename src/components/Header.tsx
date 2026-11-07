import React from 'react';
import { ShoppingBag, Sun, Moon, Search, X, Lock } from 'lucide-react';
import { Currency } from '../utils/format';
import { BRAND_LOGO } from '../data/products';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onChangeCurrency: (c: Currency) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectCategory: (cat: 'all' | 'textiles') => void;
  activeCategory: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  currency,
  onChangeCurrency,
  isDark,
  onToggleTheme,
  onSelectCategory,
  activeCategory,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
}) => {
  const [showSearchInput, setShowSearchInput] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark / Brand Mark) — Zone 2 (Textiles Link) — Zone 3 (1 Primary Action Group) */}
        <div className="flex items-center justify-between gap-6 lg:gap-8 h-20">
          {/* Zone 1: Brand Wordmark with Official OMED Logo */}
          <button
            onClick={() => onSelectCategory('textiles')}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 text-left group"
            aria-label="OMED - Home"
          >
            <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-black border border-stone-800/80 shrink-0 shadow-md flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
              <img
                src={BRAND_LOGO}
                alt="OMED Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-stone-900 dark:text-stone-100 font-display leading-none">
                OMED
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 font-medium mt-1">
                Tunisie · Textiles
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Only Textiles) */}
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => onSelectCategory('textiles')}
              className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 border-stone-900 dark:border-stone-100 text-stone-950 dark:text-white font-semibold"
            >
              Textiles
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Affordance */}
            {showSearchInput ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  autoFocus
                  className="w-36 sm:w-48 pl-2 pr-7 py-1 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-all"
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="absolute right-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  aria-label="Fermer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
                aria-label="Ouvrir la recherche"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Currency Selector (TND as first default) */}
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as Currency)}
              aria-label="Sélectionner la devise"
              className="text-xs bg-transparent border-0 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-mono cursor-pointer focus:outline-none focus:ring-0 py-1"
            >
              <option value="TND" className="bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">TND (DT)</option>
              <option value="EUR" className="bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">EUR (€)</option>
              <option value="USD" className="bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">USD ($)</option>
              <option value="GBP" className="bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">GBP (£)</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Private Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
              title="Espace Privé (Gestion Commandes & Clients)"
              aria-label="Accéder à l'espace privé"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Bag Button (Contiguous Action) */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-sm"
              aria-label={`Panier contenant ${cartCount} articles`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Panier</span>
              <span className="font-mono tabular-nums px-1.5 py-0.2 bg-stone-800 dark:bg-stone-200 rounded text-[11px]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
