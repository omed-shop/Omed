import React from 'react';
import { Product, ProductVariant } from '../types';
import { Currency, formatPrice } from '../utils/format';
import { X, Check, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingBag } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'details' | 'materials' | 'dimensions'>('details');
  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Sync selected variant when product changes
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find((v) => v.inStock) || product.variants[0];
      setSelectedVariant(firstAvailable);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
    setActiveTab('details');
    setAddedAnimation(false);
    setImageError(false);
  }, [product]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const currentPrice = product.price + (selectedVariant?.extraPrice || 0);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Gallery / Image Viewport */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center overflow-hidden">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="p-8 text-center text-stone-400">
                <span className="font-mono text-xs uppercase">omed studio object</span>
                <p className="mt-2 text-stone-700 dark:text-stone-300 font-medium">{product.name}</p>
              </div>
            )}

            {product.badge && (
              <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs uppercase tracking-wider font-medium px-2.5 py-1 rounded-xs">
                {product.badge}
              </div>
            )}
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-5">
              {/* Category & Origin */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
                <span>{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Crafted in {product.origin}</span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-display">
                  {product.name}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Catalog Ref: {product.slug.toUpperCase()}
                </p>
              </div>

              {/* Price Baseline */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatPrice(currentPrice, currency)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm font-mono tabular-nums line-through text-stone-400">
                    {formatPrice(product.compareAtPrice, currency)}
                  </span>
                )}
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 ml-auto">
                  {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Variant Selector (if available) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                    <span>Variant / Finish:</span>
                    <span className="text-stone-500 dark:text-stone-400">{selectedVariant?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          disabled={!v.inStock}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 border ${
                            isSelected
                              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                              : v.inStock
                              ? 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-500'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 line-through border-stone-200 dark:border-stone-800 cursor-not-allowed'
                          }`}
                        >
                          {v.name}
                          {v.extraPrice ? ` (${v.extraPrice > 0 ? '+' : ''}${formatPrice(v.extraPrice, currency)})` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Add to Bag Contiguous Action */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium text-stone-900 dark:text-stone-100 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      disabled={quantity >= product.stockCount}
                      className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 text-xs uppercase tracking-wider font-semibold rounded transition-all duration-200 shadow-sm ${
                      addedAnimation
                        ? 'bg-emerald-700 text-white'
                        : product.inStock
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white'
                        : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Ajouté au panier</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{product.inStock ? `Ajouter au Panier · ${formatPrice(currentPrice * quantity, currency)}` : 'Épuisé'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Informational Tabs (Details / Materials / Dimensions) */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="flex border-b border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-500 dark:text-stone-400">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 mr-4 transition-colors ${
                      activeTab === 'details'
                        ? 'border-b-2 border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                        : 'hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Narrative
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`pb-2 mr-4 transition-colors ${
                      activeTab === 'materials'
                        ? 'border-b-2 border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                        : 'hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Materials
                  </button>
                  <button
                    onClick={() => setActiveTab('dimensions')}
                    className={`pb-2 transition-colors ${
                      activeTab === 'dimensions'
                        ? 'border-b-2 border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                        : 'hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Dimensions
                  </button>
                </div>

                <div className="pt-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed min-h-[90px]">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p>{product.description}</p>
                      <p className="text-stone-500 dark:text-stone-400 italic">{product.story}</p>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <ul className="space-y-1.5 list-disc pl-4 text-stone-600 dark:text-stone-300">
                      {product.materials.map((mat, i) => (
                        <li key={i}>{mat}</li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'dimensions' && (
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-stone-900 dark:text-stone-100">{product.dimensions}</p>
                      <p className="text-stone-500 text-[11px]">Hand-inspected before dispatch from {product.origin}.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-2 text-[11px] text-stone-500 dark:text-stone-400 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-800 dark:text-stone-200" />
                <span>Livraison 24/48h</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-800 dark:text-stone-200" />
                <span>Garantie OMED</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-stone-800 dark:text-stone-200" />
                <span>Paiement Réception</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
