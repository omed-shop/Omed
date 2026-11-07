import React from 'react';
import { Product, ProductCategory } from '../types';
import { Currency, formatPrice } from '../utils/format';
import { X, Upload, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { BRAND_LOGO } from '../data/products';

interface ProductAdminModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  currency: Currency;
}

const CATEGORY_OPTIONS: { id: ProductCategory; label: string }[] = [
  { id: 'textiles', label: 'Textiles' },
];

const PRESET_IMAGES = [
  { label: 'Tricot Mérinos OMED', url: '/src/assets/images/product_omed_knitwear_1794074823555.jpg' },
  { label: 'Plaid Lin & Coton', url: '/src/assets/images/hero_omed_campaign_1794074822506.jpg' },
  { label: 'Fouta Double Tissage', url: '/src/assets/images/product_omed_wallet_1794074823228.jpg' },
  { label: 'Chemise Lin Pur', url: '/src/assets/images/product_omed_lamp_1794074822423.jpg' },
  { label: 'Étole Cachemire', url: '/src/assets/images/product_omed_fragrance_1794074824083.jpg' },
  { label: 'Emblème OMED® Broderie', url: BRAND_LOGO },
];

export const ProductAdminModal: React.FC<ProductAdminModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave,
  currency,
}) => {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<'textiles'>('textiles');
  const [tagline, setTagline] = React.useState('');
  const [price, setPrice] = React.useState<number>(85);
  const [compareAtPrice, setCompareAtPrice] = React.useState<number | undefined>(undefined);
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [story, setStory] = React.useState('');
  const [materialsStr, setMaterialsStr] = React.useState('');
  const [dimensions, setDimensions] = React.useState('');
  const [origin, setOrigin] = React.useState('Tunis, Tunisie');
  const [stockCount, setStockCount] = React.useState<number>(15);
  const [badge, setBadge] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Sync form state when modal opens or productToEdit changes
  React.useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory('textiles');
      setTagline(productToEdit.tagline);
      setPrice(productToEdit.price);
      setCompareAtPrice(productToEdit.compareAtPrice);
      setImage(productToEdit.image);
      setDescription(productToEdit.description);
      setStory(productToEdit.story);
      setMaterialsStr(productToEdit.materials.join(', '));
      setDimensions(productToEdit.dimensions);
      setOrigin(productToEdit.origin);
      setStockCount(productToEdit.stockCount);
      setBadge(productToEdit.badge || '');
    } else {
      setName('');
      setCategory('textiles');
      setTagline('');
      setPrice(0);
      setCompareAtPrice(undefined);
      setImage('');
      setDescription('');
      setStory('');
      setMaterialsStr('100% Coton peigné, Lin pur lavé');
      setDimensions('Tailles S, M, L, XL');
      setOrigin('Tunis Atelier, Tunisie');
      setStockCount(10);
      setBadge('Nouveauté');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to DataURL base64 so any photo works immediately)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("L'image sélectionnée dépasse 8 Mo. Veuillez choisir une photo plus légère.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Veuillez renseigner le nom de l'article.");
      return;
    }
    if (!image.trim()) {
      setError("Veuillez choisir ou charger une image pour l'article.");
      return;
    }
    if (price <= 0) {
      setError('Le prix doit être supérieur à 0 DT.');
      return;
    }

    const catObj = CATEGORY_OPTIONS.find((c) => c.id === category);
    const categoryLabel = catObj ? catObj.label : 'Objets';

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const materials = materialsStr
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const savedProduct: Product = {
      id: productToEdit ? productToEdit.id : `omed-${Date.now().toString(36)}`,
      name: name.trim(),
      slug: slug || `article-${Date.now()}`,
      category,
      categoryLabel,
      tagline: tagline.trim() || `Création signée OMED, fabriquée à la main en Tunisie.`,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      image: image.trim(),
      description: description.trim() || tagline.trim() || `Pièce de design contemporain façonnée par les ateliers OMED.`,
      story: story.trim() || `Fabriqué selon les standards d'excellence OMED avec des matières nobles sélectionnées.`,
      materials: materials.length > 0 ? materials : ['Matières Nobles', 'Savoir-Faire Artisanal'],
      dimensions: dimensions.trim() || 'Dimensions standards',
      origin: origin.trim() || 'Tunisie',
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
      badge: badge.trim() || undefined,
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewCount: productToEdit ? productToEdit.reviewCount : 1,
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl p-6 my-auto text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-5">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider font-display">
              {productToEdit ? `Modifier : ${productToEdit.name}` : '+ Ajouter un Nouvel Article'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Gérez les informations, photos, tarifs en DT et disponibilité de vos produits OMED.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Nom, Catégorie, Prix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Nom de l'article *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sacoche Bandoulière en Cuir"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Prix, Prix Barré & Quantité Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Prix de vente (DT) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-stone-400">DT</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Prix barré (Optionnel)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={compareAtPrice || ''}
                  onChange={(e) => setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Ex: 120"
                  className="w-full px-3 py-2 text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-stone-400">DT</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Quantité en stock *
              </label>
              <input
                type="number"
                min={0}
                value={stockCount}
                onChange={(e) => setStockCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Section 3: Image de l'article (Upload / URL / Presets) */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-800 space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Photographie de l'Article
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Image Preview Box */}
              <div className="sm:col-span-4 aspect-square rounded-lg bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 overflow-hidden flex items-center justify-center relative shadow-xs">
                {image ? (
                  <img src={image} alt="Aperçu article" className="w-full h-full object-cover object-center" />
                ) : (
                  <div className="text-center p-3 text-stone-400">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-[10px]">Aucune image</span>
                  </div>
                )}
              </div>

              {/* Upload Input & Presets */}
              <div className="sm:col-span-8 space-y-2.5">
                {/* File Upload Button */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Charger une photo depuis votre appareil (Téléphone ou Ordinateur) :
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir une photo...</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Direct URL input */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Ou coller le lien / URL d'une image :
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... ou /assets/..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono text-[11px]"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                    Ou sélectionner un modèle existant :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImage(preset.url)}
                        className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          image === preset.url
                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Accroche, Description & Histoire */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Accroche / Phrase de présentation courte
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Cuir pleine fleur au tannage végétal avec finitions polies à la main."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Description détaillée du produit
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez les fonctionnalités, l'ergonomie, la texture et les points forts de cette pièce..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Histoire & Savoir-faire artisanal
              </label>
              <textarea
                rows={2}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Ex: Conçu et cousu à la main dans les ateliers de la Médina de Tunis par nos maîtres artisans..."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Section 5: Matières, Dimensions, Atelier & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Matières (séparées par une virgule)
              </label>
              <input
                type="text"
                value={materialsStr}
                onChange={(e) => setMaterialsStr(e.target.value)}
                placeholder="Ex: Cuir pleine fleur, Laiton massif, Fil de lin ciré"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Dimensions & Spécifications
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ex: H 320mm × L 240mm · Poids 450g"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Atelier / Origine
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: Tunis Atelier, Tunisie"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Badge d'étiquette (Optionnel)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ex: Nouveauté, Édition Limitée, Best-seller"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500">
              Prix affiché : <strong className="text-stone-900 dark:text-stone-100">{formatPrice(price, currency)}</strong>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{productToEdit ? 'Mettre à jour l’article' : 'Enregistrer cet Article'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
