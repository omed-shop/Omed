import React from 'react';
import { CartItem } from '../types';
import { Currency, formatPrice } from '../utils/format';
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  currency: Currency;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = React.useState('');
  const [promoMessage, setPromoMessage] = React.useState<string | null>(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate totals in TND base
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.selectedVariant?.extraPrice || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = 120; // 120 DT for free delivery in Tunisia
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP' || appliedPromo === 'LIVRAISON';
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 7; // 7 DT standard courier fee
  const discountRate = appliedPromo === 'OMED10' ? 0.1 : 0;
  const discountAmount = subtotal * discountRate;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoMessage('Code promo appliqué avec succès');
    } else {
      setPromoMessage('Code promo invalide. Essayez "OMED10"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col h-full transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
              Mon Panier
            </h2>
            <span className="text-xs font-mono text-stone-500">
              ({items.reduce((acc, it) => acc + it.quantity, 0)})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter in Tunisia */}
        <div className="px-5 py-3 bg-stone-100 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Félicitations ! Vous bénéficiez de la livraison gratuite sur toute la Tunisie
            </p>
          ) : (
            <div>
              <p className="text-stone-600 dark:text-stone-300">
                Ajoutez <span className="font-mono font-semibold">{formatPrice(freeShippingThreshold - subtotal, currency)}</span> supplémentaires pour la livraison gratuite
              </p>
              <div className="mt-2 w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Itemized Cart List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="text-stone-400 text-sm">Votre panier est actuellement vide.</span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Explorer la collection
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemUnitPrice = item.product.price + (item.selectedVariant?.extraPrice || 0);
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || 'default'}-${idx}`}
                  className="flex gap-4 pb-4 border-b border-stone-100 dark:border-stone-800"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                          aria-label={`Supprimer ${item.product.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {item.selectedVariant.name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded bg-white dark:bg-stone-800">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                          aria-label="Diminuer quantité"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-[11px] font-mono tabular-nums text-stone-800 dark:text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                          aria-label="Augmenter quantité"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-xs font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice(itemUnitPrice * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Code promo (ex: OMED10)"
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-200 dark:bg-stone-800 rounded hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Appliquer
              </button>
            </form>

            {promoMessage && (
              <p className={`text-[11px] ${appliedPromo ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {promoMessage}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Remise OMED (-10%)</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(discountAmount, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Livraison Express Tunisie</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost, currency)}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
                <span>Total Net</span>
                <span className="font-mono tabular-nums">
                  {formatPrice(finalTotal, currency)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors shadow-sm"
            >
              <span>Commander · Paiement à la livraison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Commande sécurisée · Paiement en espèces ou en ligne</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
