import React from 'react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { Product, CartItem, ConfirmedOrder, ProductCategory, ProductVariant } from './types';
import { Currency } from './utils/format';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PhilosophySection } from './components/PhilosophySection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { INITIAL_ORDERS } from './data/mockOrders';
import { SlidersHorizontal, Check, Search, RotateCcw, ShoppingBag, Lock } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omed_theme') === 'dark';
    }
    return false;
  });

  // Sync dark class on document element
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omed_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omed_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Currency State - Tunisian Dinar (TND) as default
  const [currency, setCurrency] = React.useState<Currency>('TND');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('omed_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default starter item for immediate tactile preview
    return [
      {
        product: PRODUCTS[1], // Cognac Saddle Card Wallet (85 DT)
        selectedVariant: PRODUCTS[1].variants?.[0],
        quantity: 1,
      },
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('omed_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // UI Flow States
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = React.useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Clean up any old demo/test keys from earlier versions
  React.useEffect(() => {
    try {
      localStorage.removeItem('omed_orders');
      localStorage.removeItem('omed_products');
      localStorage.removeItem('omed_products_v2');
      localStorage.removeItem('omed_textile_products');
      localStorage.removeItem('omed_textiles_catalog');
    } catch {
      // ignore
    }
  }, []);

  // Orders State (Private Dashboard) - Clean slate for production
  const [orders, setOrders] = React.useState<ConfirmedOrder[]>(() => {
    try {
      const savedOrders = localStorage.getItem('omed_live_orders');
      if (savedOrders) return JSON.parse(savedOrders);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS; // empty []
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('omed_live_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Statut commande ${orderId} mis à jour`);
  };

  // Products State - Clean slate for production (Articles added via Private Dashboard)
  const [products, setProducts] = React.useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('omed_live_catalog');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return PRODUCTS; // empty []
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('omed_live_catalog', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Article "${newProduct.name}" ajouté`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Article "${updatedProduct.name}" mis à jour`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Article supprimé du catalogue');
  };

  const handleCreateManualOrder = (newOrder: ConfirmedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Commande ${newOrder.orderId} ajoutée avec succès`);
  };

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = React.useState('');

  // Filtering & Search (Textiles only)
  const [activeCategory, setActiveCategory] = React.useState<ProductCategory>('textiles');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Trigger Toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (it) => it.product.id === product.id && it.selectedVariant?.id === variant?.id
      );

      if (existingIdx > -1) {
        const next = [...prevCart];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [...prevCart, { product, selectedVariant: variant, quantity }];
      }
    });

    showToast(`Added ${quantity}× ${product.name} to bag`);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    handleAddToCart(product, defaultVariant, 1);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from shopping bag');
  };

  const handleApplyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'OMED10' || normalized === 'FREESHIP') {
      setAppliedPromo(normalized);
      showToast(`Promo ${normalized} applied`);
      return true;
    }
    return false;
  };

  const handleOrderSuccess = (order: ConfirmedOrder) => {
    // Extract phone from order notes or shipping details
    const phone = order.shippingDetails.orderNotes?.match(/\+?216\s?[0-9\s]+/)?.[0] || order.customerPhone || '';
    const fullOrder: ConfirmedOrder = {
      ...order,
      status: 'nouvelle',
      customerPhone: phone,
      createdAt: new Date().toISOString(),
    };

    // Prepend to orders list for admin dashboard
    setOrders((prev) => [fullOrder, ...prev]);

    // Clear cart on successful purchase
    setCart([]);
    showToast(`Commande ${order.orderId} enregistrée`);
  };

  // Filter & Sort Products
  const filteredProducts = React.useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTagline = item.tagline.toLowerCase().includes(q);
        const matchesMaterials = item.materials.some((m) => m.toLowerCase().includes(q));
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesTagline || matchesMaterials || matchesDesc;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured maintains editorial order
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Top Bar Contract */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onChangeCurrency={setCurrency}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Campaign Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Catalog Section */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Section Header & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-medium mb-1">
                <span>Catalogue Exclusif OMED</span>
                <span aria-hidden="true">·</span>
                <span>Ateliers Tunisie</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-display">
                Nos Créations Signées
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
              <span>{filteredProducts.length} pièces disponibles</span>
            </div>
          </div>

          {/* Interactive Filter Tabs & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Filter Tabs (Functional segmented buttons) */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/60 dark:bg-stone-900 rounded-lg overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-xs font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort & Quick Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier les produits par"
                className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
              >
                <option value="featured">Sélection OMED</option>
                <option value="price-asc">Prix : Moins cher au plus cher</option>
                <option value="price-desc">Prix : Plus cher au moins cher</option>
                <option value="rating">Mieux notés</option>
              </select>

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-300 dark:border-stone-700 rounded text-xs flex items-center gap-1"
                  title="Effacer la recherche"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Effacer</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Search Indicator */}
          {searchQuery && (
            <div className="mb-6 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <Search className="w-3.5 h-3.5" />
              <span>
                Matching term "{searchQuery}" ({filteredProducts.length} results)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-900 dark:text-stone-100 underline ml-2"
              >
                Clear search
              </button>
            </div>
          )}

          {/* 3-Column / 2-Column Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 px-6 text-center max-w-lg mx-auto bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-700 dark:text-stone-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-display">
                Collection en cours de mise en ligne
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                Notre atelier prépare actuellement les nouvelles créations textiles exclusives OMED®.
              </p>
              <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-all shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Espace Privé · Ajouter un article</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-stone-100/50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-300 dark:border-stone-800">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Aucun article ne correspond à votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded hover:bg-white dark:hover:bg-stone-800 transition-colors"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </section>

        {/* Craftsmanship & Manifesto Section */}
        <PhilosophySection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminLoginOpen(true)} />

      {/* Product Detail Modal (Contiguous Purchase Module) */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, variant, qty) => {
          handleAddToCart(product, variant, qty);
        }}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Admin Passcode Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminDashboardOpen(true)}
      />

      {/* Private Admin Dashboard (Management Portal) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onCreateManualOrder={handleCreateManualOrder}
          onClose={() => setIsAdminDashboardOpen(false)}
          currency={currency}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Global Minimalist Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2.5 rounded shadow-lg flex items-center gap-2 text-xs font-medium animate-fade-in transition-all">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
