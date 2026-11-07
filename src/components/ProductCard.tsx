import React from 'react';
import { Product } from '../types';
import { Currency, formatPrice } from '../utils/format';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Product Image Container (65-75% of card height) */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-stone-950 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-stone-900 text-stone-400">
            <span className="text-xs uppercase tracking-widest font-mono">omed object</span>
            <span className="text-sm font-medium mt-1 text-stone-700 dark:text-stone-300">{product.name}</span>
          </div>
        )}

        {/* Subtle Text Tag (Only 1 subtle tag, never pill clusters) */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-xs">
            {product.badge}
          </div>
        )}

        {/* Quick Action Overlay on Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSelectProduct(product)}
            className="flex-1 py-2 px-3 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white/95 dark:bg-stone-800/95 backdrop-blur-sm rounded shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-1.5"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onQuickAdd(product)}
            className="py-2 px-3 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded shadow-sm hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center justify-center gap-1"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.origin.split(',')[0]}</span>
          </div>

          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing and Stock Status Baseline */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {formatPrice(product.price, currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-mono tabular-nums line-through text-stone-400">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            {product.inStock ? `${product.stockCount} available` : 'Sold out'}
          </span>
        </div>
      </div>
    </div>
  );
};
