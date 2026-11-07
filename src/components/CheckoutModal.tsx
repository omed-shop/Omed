import React from 'react';
import { CartItem, ConfirmedOrder, ShippingDetails } from '../types';
import { Currency, formatPrice } from '../utils/format';
import { BRAND_LOGO } from '../data/products';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Sparkles, Printer, ArrowLeft, Phone, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedPromo: string;
  onOrderSuccess: (order: ConfirmedOrder) => void;
}

const TUNISIAN_GOVERNORATES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Le Kef',
  'Siliana',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Médenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili',
  'Zaghouan',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedPromo,
  onOrderSuccess,
}) => {
  const [step, setStep] = React.useState<'details' | 'payment' | 'confirmation'>('details');
  const [confirmedOrder, setConfirmedOrder] = React.useState<ConfirmedOrder | null>(null);

  // Form State localized for Tunisia
  const [formData, setFormData] = React.useState<ShippingDetails>({
    fullName: '',
    email: '',
    address: '',
    city: 'Tunis',
    postalCode: '1001',
    country: 'Tunisie',
    shippingMethod: 'standard',
    paymentMethod: 'cod', // COD is standard in Tunisia
    orderNotes: '',
  });

  const [phone, setPhone] = React.useState('');
  const [selectedGovernorate, setSelectedGovernorate] = React.useState('Tunis');

  // Credit Card mock inputs
  const [cardNumber, setCardNumber] = React.useState('5359 •••• •••• 1042');
  const [cardExpiry, setCardExpiry] = React.useState('09/28');
  const [cardCvc, setCardCvc] = React.useState('412');

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && step !== 'confirmation') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, step]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.selectedVariant?.extraPrice || 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  const isFreeStandard = subtotal >= 120 || appliedPromo === 'FREESHIP' || appliedPromo === 'LIVRAISON';
  const shippingCost = isFreeStandard ? 0 : 7;
  const discountRate = appliedPromo === 'OMED10' ? 0.1 : 0;
  const discountAmount = subtotal * discountRate;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleFillDemo = () => {
    setFormData({
      fullName: 'Mohamed Ben Salem',
      email: 'mohamed.bensalem@gmail.com',
      address: 'Résidence Les Palmiers, Avenue Hédi Nouira, Ennasr 2',
      city: 'Ariana',
      postalCode: '2037',
      country: 'Tunisie',
      shippingMethod: 'standard',
      paymentMethod: 'cod',
      orderNotes: 'Appeler avant de livrer s.v.p.',
    });
    setPhone('216 98 456 789');
    setSelectedGovernorate('Ariana');
    setFormErrors({});
  };

  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Nom et prénom requis';
    if (!phone.trim()) errors.phone = 'Numéro de téléphone requis pour le livreur';
    if (!formData.address.trim()) errors.address = 'Adresse exacte requise';
    if (!formData.city.trim()) errors.city = 'Ville / Délégation requise';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `OMED-TN-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: ConfirmedOrder = {
        orderId: orderNumber,
        date: new Date().toLocaleDateString('fr-TN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        createdAt: new Date().toISOString(),
        status: 'nouvelle',
        customerPhone: phone ? (phone.startsWith('+216') ? phone : `+216 ${phone}`) : '',
        items: [...items],
        subtotal,
        shippingCost,
        discount: discountAmount,
        total: totalAmount,
        shippingDetails: {
          ...formData,
          city: `${selectedGovernorate} - ${formData.city}`,
          orderNotes: phone ? `Tel: ${phone} | ${formData.orderNotes || ''}` : formData.orderNotes,
        },
      };

      setConfirmedOrder(order);
      onOrderSuccess(order);
      setStep('confirmation');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with OMED Brand */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                aria-label="Retour aux coordonnées"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="h-8 w-8 rounded bg-black p-0.5 border border-stone-800 shrink-0">
              <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
                {step === 'confirmation' ? 'Commande Confirmée' : 'Finaliser la Commande'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {step === 'details' && 'Étape 1 sur 2 : Coordonnées de livraison en Tunisie'}
                {step === 'payment' && 'Étape 2 sur 2 : Mode de paiement & Confirmation'}
                {step === 'confirmation' && 'Votre colis est en cours de préparation'}
              </p>
            </div>
          </div>

          {step !== 'confirmation' ? (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              aria-label="Annuler la commande"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs uppercase tracking-wider font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Fermer
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Shipping Details for Tunisia */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Adresse de livraison (Tunisie)
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Remplir exemple Tunisie</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Mohamed Ben Salem"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                  {formErrors.fullName && <p className="text-[11px] text-rose-500 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Numéro de Téléphone (Mobile) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 98 123 456"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  {formErrors.phone && <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Adresse complète (Rue, Immeuble, Étage) *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Résidence Les Roses, Rue Habib Thameur, Appartement 4"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
                {formErrors.address && <p className="text-[11px] text-rose-500 mt-1">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Gouvernorat *
                  </label>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  >
                    {TUNISIAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Ville / Délégation *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: La Marsa, Ennasr, Menzah..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                  {formErrors.city && <p className="text-[11px] text-rose-500 mt-1">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre.email@domain.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Mode de Livraison */}
              <div className="pt-2">
                <span className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Mode de Livraison
                </span>
                <div className="p-3.5 border border-stone-900 dark:border-stone-100 bg-stone-50/80 dark:bg-stone-800/80 rounded flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      Livraison à Domicile (24h à 48h)
                    </span>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Expédition soignée et suivie sur les 24 gouvernorats de Tunisie
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100 shrink-0 ml-3">
                    {isFreeStandard ? 'Gratuit' : formatPrice(7, currency)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors"
                >
                  Continuer vers le Paiement
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Final Review for Tunisia */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Recipient summary strip */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded border border-stone-200 dark:border-stone-800 text-xs flex justify-between items-center">
                <div>
                  <span className="text-stone-500">Destinataire : </span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {formData.fullName} ({phone}) · {selectedGovernorate}, {formData.city}
                  </span>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-stone-600 dark:text-stone-300 underline text-[11px] ml-2 shrink-0"
                >
                  Modifier
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Mode de Règlement
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-3 border rounded flex flex-col items-center gap-1.5 text-xs transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 font-semibold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>À la livraison (Espèces)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 border rounded flex flex-col items-center gap-1.5 text-xs transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 font-semibold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Carte Bancaire / Edinar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'apple_pay' })}
                    className={`p-3 border rounded flex flex-col items-center gap-1.5 text-xs transition-all ${
                      formData.paymentMethod === 'apple_pay'
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 font-semibold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>D17 / Flouci</span>
                  </button>
                </div>

                {/* Sub-inputs based on payment selection */}
                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-800/50 text-xs text-stone-700 dark:text-stone-300">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4" />
                      <span>Paiement en espèces à la livraison (Recommandé en Tunisie)</span>
                    </p>
                    <p>
                      Vous payez exactement <span className="font-mono font-bold text-stone-950 dark:text-white">{formatPrice(totalAmount, currency)}</span> au livreur lors de la remise en main propre de votre colis OMED. Vous pouvez ouvrir le colis et vérifier vos articles.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-200 dark:border-stone-800 space-y-3">
                    <div className="text-[11px] text-stone-500">
                      Paiement sécurisé via le switch national GNT (Cartes bancaires tunisiennes CIB, Edinar, Visa, Mastercard)
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                          Expiration (MM/AA)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                          Code CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'apple_pay' && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 text-center">
                    Transfert D17 La Poste Tunisienne ou Flouci. Le QR Code de paiement instantané s'affichera dès la confirmation.
                  </div>
                )}
              </div>

              {/* Order Items Review Summary */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Récapitulatif de commande ({items.length} articles)
                </span>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs text-stone-600 dark:text-stone-400">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}× {it.product.name} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}</span>
                      <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice((it.product.price + (it.selectedVariant?.extraPrice || 0)) * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 text-xs space-y-1">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Frais de livraison</span>
                    <span className="font-mono tabular-nums">{shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost, currency)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Remise code promo</span>
                      <span className="font-mono tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-1">
                    <span>Montant total à régler</span>
                    <span className="font-mono tabular-nums">{formatPrice(totalAmount, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Complete Order CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirmation de commande en cours...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmer la Commande · {formatPrice(totalAmount, currency)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation with OMED Crest */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                    Commande {confirmedOrder.orderId} Validée avec Succès
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Notre équipe prépare votre colis avec soin. Le livreur vous contactera par téléphone pour convenir de l'heure exacte de passage.
                  </p>
                </div>
              </div>

              {/* Receipt Summary Card with Logo */}
              <div className="p-5 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-200 dark:border-stone-800 space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded bg-black p-0.5 border border-stone-800 shrink-0">
                      <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-stone-500 uppercase tracking-widest text-[9px] block">Référence OMED</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {confirmedOrder.orderId}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 uppercase tracking-widest text-[9px] block">Date</span>
                    <span className="font-mono text-stone-800 dark:text-stone-200">{confirmedOrder.date}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-stone-500 uppercase tracking-widest text-[10px] block">Articles Commandés</span>
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-stone-800 dark:text-stone-200">
                      <div>
                        <span className="font-medium">{it.quantity}× {it.product.name}</span>
                        {it.selectedVariant && (
                          <span className="text-stone-500 text-[11px] ml-1">· {it.selectedVariant.name}</span>
                        )}
                      </div>
                      <span className="font-mono tabular-nums">
                        {formatPrice((it.product.price + (it.selectedVariant?.extraPrice || 0)) * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dispatch Destination */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-500 uppercase tracking-widest text-[10px] block mb-0.5">Livraison</span>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">{confirmedOrder.shippingDetails.fullName}</p>
                    <p className="text-stone-500 text-[11px]">{confirmedOrder.shippingDetails.address}</p>
                    <p className="text-stone-500 text-[11px]">{confirmedOrder.shippingDetails.city}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 uppercase tracking-widest text-[10px] block mb-0.5">Règlement & Suivi</span>
                    <p className="text-stone-800 dark:text-stone-200">
                      Paiement : {confirmedOrder.shippingDetails.paymentMethod === 'cod' ? 'Espèces à la livraison' : 'Paiement électronique'}
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Expéditeur : OMED Ateliers Tunisie (Colis Suivi)
                    </p>
                    <p className="text-stone-900 dark:text-stone-100 font-mono font-bold mt-1 text-sm">
                      Total : {formatPrice(confirmedOrder.total, currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer le Reçu</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
