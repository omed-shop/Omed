import React from 'react';
import { ConfirmedOrder, OrderStatus, CartItem, Product } from '../types';
import { BRAND_LOGO } from '../data/products';
import { Currency, formatPrice } from '../utils/format';
import { ProductAdminModal } from './ProductAdminModal';
import {
  Package,
  Users,
  Search,
  Plus,
  Download,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  Printer,
  X,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Layers,
  Edit3,
  Trash2,
  Tag,
  ShoppingBag
} from 'lucide-react';

interface AdminDashboardProps {
  orders: ConfirmedOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCreateManualOrder: (newOrder: ConfirmedOrder) => void;
  onClose: () => void;
  currency: Currency;
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const TUNISIAN_GOVERNORATES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Sousse', 'Monastir', 'Mahdia',
  'Sfax', 'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan', 'Kasserine',
  'Sidi Bouzid', 'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili', 'Zaghouan'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onCreateManualOrder,
  onClose,
  currency,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'articles' | 'customers'>('orders');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = React.useState<ConfirmedOrder | null>(null);
  const [isTakeOrderOpen, setIsTakeOrderOpen] = React.useState(false);

  // Product Admin States
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(null);
  const [articleSearchQuery, setArticleSearchQuery] = React.useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = React.useState('all');

  // Manual Order Form State
  const [manualClientName, setManualClientName] = React.useState('');
  const [manualPhone, setManualPhone] = React.useState('');
  const [manualAddress, setManualAddress] = React.useState('');
  const [manualGovernorate, setManualGovernorate] = React.useState('Tunis');
  const [manualCity, setManualCity] = React.useState('');
  const [manualSelectedProductId, setManualSelectedProductId] = React.useState(products[0]?.id || 'omed-01');
  const [manualQuantity, setManualQuantity] = React.useState(1);
  const [manualNotes, setManualNotes] = React.useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = React.useState<'cod' | 'card'>('cod');

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'annulee' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'nouvelle' || o.status === 'confirmee').length;
  const inDeliveryCount = orders.filter((o) => o.status === 'en_livraison').length;
  const deliveredCount = orders.filter((o) => o.status === 'livree').length;
  const cashToCollect = orders
    .filter((o) => (o.status === 'en_livraison' || o.status === 'confirmee') && o.shippingDetails.paymentMethod === 'cod')
    .reduce((sum, o) => sum + o.total, 0);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.shippingDetails.fullName.toLowerCase().includes(q);
      const matchPhone = (o.customerPhone || o.shippingDetails.orderNotes || '').toLowerCase().includes(q);
      const matchCity = o.shippingDetails.city.toLowerCase().includes(q);
      const matchAddress = o.shippingDetails.address.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity || matchAddress;
    }
    return true;
  });

  // Extract Customers Directory
  const customersList = React.useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      totalSpent: number;
      ordersCount: number;
      lastOrderDate: string;
    }>();

    orders.forEach((o) => {
      const phone = o.customerPhone || (o.shippingDetails.orderNotes?.match(/\+?216\s?[0-9\s]+/)?.[0] || 'Non renseigné');
      const key = o.shippingDetails.fullName.toLowerCase() + phone;

      if (!map.has(key)) {
        map.set(key, {
          name: o.shippingDetails.fullName,
          phone: phone,
          email: o.shippingDetails.email || '—',
          address: o.shippingDetails.address,
          city: o.shippingDetails.city,
          totalSpent: o.total,
          ordersCount: 1,
          lastOrderDate: o.date,
        });
      } else {
        const existing = map.get(key)!;
        existing.totalSpent += o.total;
        existing.ordersCount += 1;
        existing.lastOrderDate = o.date;
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Filter Products for Admin Articles Tab
  const filteredAdminProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (articleCategoryFilter !== 'all' && p.category !== articleCategoryFilter) return false;
      if (articleSearchQuery.trim()) {
        const q = articleSearchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, articleCategoryFilter, articleSearchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Référence',
      'Date',
      'Client',
      'Téléphone',
      'Adresse',
      'Ville/Gouvernorat',
      'Articles',
      'Total DT',
      'Paiement',
      'Statut',
    ];

    const rows = orders.map((o) => [
      o.orderId,
      o.date,
      `"${o.shippingDetails.fullName.replace(/"/g, '""')}"`,
      `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
      `"${o.shippingDetails.address.replace(/"/g, '""')}"`,
      `"${o.shippingDetails.city.replace(/"/g, '""')}"`,
      `"${o.items.map((it) => `${it.quantity}x ${it.product.name}`).join(' | ')}"`,
      o.total,
      o.shippingDetails.paymentMethod,
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OMED_Commandes_Tunisie_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Manual Order Submission
  const handleSaveManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName.trim() || !manualPhone.trim() || !manualAddress.trim()) {
      alert('Veuillez remplir le nom, téléphone et adresse du client.');
      return;
    }

    const prod = products.find((p) => p.id === manualSelectedProductId) || products[0];
    const subtotal = prod.price * manualQuantity;
    const isFree = subtotal >= 120;
    const shipping = isFree ? 0 : 7;
    const total = subtotal + shipping;

    const newOrder: ConfirmedOrder = {
      orderId: `OMED-TN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      status: 'confirmee', // Direct phone orders are already confirmed
      customerPhone: manualPhone.startsWith('+216') ? manualPhone : `+216 ${manualPhone}`,
      items: [
        {
          product: prod,
          selectedVariant: prod.variants?.[0],
          quantity: manualQuantity,
        },
      ],
      subtotal,
      shippingCost: shipping,
      discount: 0,
      total,
      shippingDetails: {
        fullName: manualClientName,
        email: '',
        address: manualAddress,
        city: `${manualGovernorate} - ${manualCity || manualGovernorate}`,
        postalCode: '1000',
        country: 'Tunisie',
        shippingMethod: 'standard',
        paymentMethod: manualPaymentMethod,
        orderNotes: `Commande prise par l'administration. Notes: ${manualNotes}`,
      },
    };

    onCreateManualOrder(newOrder);
    setIsTakeOrderOpen(false);

    // Reset Form
    setManualClientName('');
    setManualPhone('');
    setManualAddress('');
    setManualCity('');
    setManualNotes('');
    setManualQuantity(1);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'nouvelle':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" />
            <span>Nouvelle</span>
          </span>
        );
      case 'confirmee':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmée</span>
          </span>
        );
      case 'en_livraison':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Truck className="w-3 h-3" />
            <span>En Livraison</span>
          </span>
        );
      case 'livree':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Livrée & Payée</span>
          </span>
        );
      case 'annulee':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            <span>Annulée</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-100 dark:bg-stone-950 overflow-y-auto flex flex-col text-stone-900 dark:text-stone-100">
      {/* Top Bar for Admin */}
      <header className="sticky top-0 z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-black p-0.5 border border-stone-800 shrink-0">
              <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-wider uppercase font-display">OMED Backoffice</span>
                <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded font-mono">
                  Privé
                </span>
              </div>
              <p className="text-[11px] text-stone-500">Gestion des commandes & coordonnées clients (Tunisie)</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'articles' ? (
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nouvel Article</span>
              </button>
            ) : (
              <button
                onClick={() => setIsTakeOrderOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Prendre Commande</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded flex items-center gap-1.5 transition-colors"
              title="Exporter les commandes en format CSV pour Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exporter CSV</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour Boutique</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>Chiffre d'Affaires</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {formatPrice(totalRevenue, currency)}
            </div>
            <p className="mt-1 text-[11px] text-stone-400 font-mono">{orders.length} commandes enregistrées</p>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>Catalogue OMED</span>
              <Layers className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {products.length}
            </div>
            <p className="mt-1 text-[11px] text-stone-400">Articles actifs en boutique</p>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>En cours de livraison</span>
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {inDeliveryCount}
            </div>
            <p className="mt-1 text-[11px] text-stone-400">Colis remis au transporteur</p>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>Montant CRBT en attente</span>
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {formatPrice(cashToCollect, currency)}
            </div>
            <p className="mt-1 text-[11px] text-stone-400">Espèces à récupérer du livreur</p>
          </div>
        </div>

        {/* Navigation Tabs (Commandes vs Articles vs Répertoire Clients) */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Gestion des Commandes ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Articles & Catalogue ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
                activeTab === 'customers'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Coordonnées Clients ({customersList.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher client, tél, ville..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* TAB 1: ORDERS LIST */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Filter Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 mr-1 text-[11px]">Filtrer statut :</span>
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'nouvelle', label: 'Nouvelles' },
                { id: 'confirmee', label: 'Confirmées' },
                { id: 'en_livraison', label: 'En Livraison' },
                { id: 'livree', label: 'Livrées' },
                { id: 'annulee', label: 'Annulées' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    statusFilter === st.id
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Commande</th>
                      <th className="py-3 px-4">Client & Contact</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Articles</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-center">Bordereau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <Package className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            Aucune commande enregistrée
                          </p>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                            Votre boutique en ligne est prête à recevoir les commandes de vos clients en direct.
                          </p>
                          <button
                            onClick={() => setIsTakeOrderOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Prendre une commande manuelle</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const phone = order.customerPhone || order.shippingDetails.orderNotes?.match(/\+?216\s?[0-9\s]+/)?.[0] || 'Non renseigné';
                        return (
                          <tr key={order.orderId} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                                {order.orderId}
                              </span>
                              <span className="text-[11px] text-stone-400">{order.date}</span>
                            </td>

                            {/* Client & Phone */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                                {order.shippingDetails.fullName}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={`tel:${phone.replace(/\s+/g, '')}`}
                                  className="text-stone-600 dark:text-stone-300 hover:text-emerald-600 flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <Phone className="w-3 h-3 text-stone-400" />
                                  <span>{phone}</span>
                                </a>

                                <a
                                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-600 dark:text-emerald-400 underline flex items-center gap-0.5"
                                  title="Contacter sur WhatsApp"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </td>

                            {/* Destination */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-medium text-stone-800 dark:text-stone-200 block truncate">
                                {order.shippingDetails.city}
                              </span>
                              <p className="text-[11px] text-stone-500 truncate" title={order.shippingDetails.address}>
                                {order.shippingDetails.address}
                              </p>
                            </td>

                            {/* Items */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px] text-stone-700 dark:text-stone-300">
                                    <span className="font-mono font-semibold">{it.quantity}×</span> {it.product.name}
                                    {it.selectedVariant && (
                                      <span className="text-stone-400 text-[10px] ml-1">({it.selectedVariant.name})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Total & Payment method */}
                            <td className="py-3.5 px-4 text-right">
                              <span className="font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100 text-sm block">
                                {formatPrice(order.total, currency)}
                              </span>
                              <span className="text-[10px] text-stone-500 uppercase font-mono">
                                {order.shippingDetails.paymentMethod === 'cod' ? 'Espèces / COD' : 'Carte'}
                              </span>
                            </td>

                            {/* Status changer dropdown */}
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)}
                                className="text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                              >
                                <option value="nouvelle">Nouvelle</option>
                                <option value="confirmee">Confirmée</option>
                                <option value="en_livraison">En Livraison</option>
                                <option value="livree">Livrée & Payée</option>
                                <option value="annulee">Annulée</option>
                              </select>
                            </td>

                            {/* Print Delivery Slip Button */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedOrderForSlip(order)}
                                className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                title="Imprimer le bordereau de livraison pour le transporteur"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Répertoire Clients OMED
                </h3>
                <p className="text-xs text-stone-500">Coordonnées et historique d'achat en Tunisie</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Gouvernorat / Adresse</th>
                    <th className="py-3 px-4 text-center">Commandes</th>
                    <th className="py-3 px-4 text-right">Total Dépensé</th>
                    <th className="py-3 px-4">Dernière Commande</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {customersList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Users className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          Aucun client enregistré
                        </p>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                          Les coordonnées des clients s'enregistreront automatiquement dès leur première commande sur le site.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    customersList.map((client, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                        {client.name}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <a href={`tel:${client.phone.replace(/\s+/g, '')}`} className="text-emerald-700 dark:text-emerald-400 hover:underline">
                          {client.phone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-medium text-stone-800 dark:text-stone-200 block">{client.city}</span>
                        <span className="text-[11px] text-stone-500 truncate block">{client.address}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-medium">
                        {client.ordersCount}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                        {formatPrice(client.totalSpent, currency)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                        {client.lastOrderDate}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GESTION DES ARTICLES / PRODUITS */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {/* Articles Toolbar: Search & Category filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-stone-500 mr-1 text-[11px]">Rayon :</span>
                {[
                  { id: 'all', label: 'Tous les Textiles' },
                  { id: 'textiles', label: 'Textiles' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setArticleCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      articleCategoryFilter === c.id
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    placeholder="Filtrer un article..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nouvel Article</span>
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Article & Détails</th>
                      <th className="py-3 px-4">Rayon</th>
                      <th className="py-3 px-4 text-right">Prix (DT)</th>
                      <th className="py-3 px-4 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center">
                          <Layers className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            Catalogue prêt pour vos articles
                          </p>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                            Tous les articles de test ont été effacés. Ajoutez votre premier article avec sa photo, son prix en DT et sa description.
                          </p>
                          <button
                            onClick={() => {
                              setProductToEdit(null);
                              setIsProductModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter un article maintenant</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                          {/* Image Thumbnail */}
                          <td className="py-3 px-4 w-16">
                            <div className="w-12 h-12 rounded bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          </td>

                          {/* Details */}
                          <td className="py-3 px-4 max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                                {prod.name}
                              </span>
                              {prod.badge && (
                                <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.2 rounded font-medium border border-stone-200 dark:border-stone-700">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                              {prod.tagline}
                            </p>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Atelier : {prod.origin}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                            {prod.categoryLabel}
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100 block">
                              {formatPrice(prod.price, currency)}
                            </span>
                            {prod.compareAtPrice && (
                              <span className="font-mono text-[11px] text-stone-400 line-through">
                                {formatPrice(prod.compareAtPrice, currency)}
                              </span>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded font-mono text-[11px] font-medium ${
                                prod.stockCount > 0
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {prod.stockCount > 0 ? `${prod.stockCount} en stock` : 'Rupture'}
                            </span>
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setProductToEdit(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                title="Modifier cet article (photo, prix, description...)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Confirmez-vous la suppression de l'article "${prod.name}" ?`)) {
                                    onDeleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Supprimer cet article du catalogue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: PRENDRE UNE COMMANDE MANUELLE (Telephone / WhatsApp) */}
      {isTakeOrderOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                  Enregistrer une Commande (Téléphone / Message)
                </h3>
              </div>
              <button onClick={() => setIsTakeOrderOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Nom & Prénom Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualClientName}
                    onChange={(e) => setManualClientName(e.target.value)}
                    placeholder="Ex: Anis Driss"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Ex: 98 123 456"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Adresse de Livraison Exacte *
                </label>
                <input
                  type="text"
                  required
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Rue, Immeuble, Étage, Repère..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Gouvernorat *
                  </label>
                  <select
                    value={manualGovernorate}
                    onChange={(e) => setManualGovernorate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
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
                    Ville / Délégation
                  </label>
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="Ex: La Soukra, Menzah 5..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Product and Quantity Selector */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Article Commandé *
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={manualSelectedProductId}
                      onChange={(e) => setManualSelectedProductId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPrice(p.price, currency)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 font-mono"
                      placeholder="Qté"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Instructions / Notes internes
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Ex: Commande WhatsApp, envoyer emballage cadeau..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsTakeOrderOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-sm transition-colors"
                >
                  Valider & Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BORDEREAU DE LIVRAISON TRANSPORTEUR (Print Delivery Slip) */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-lg bg-white text-stone-950 p-6 rounded-lg shadow-2xl my-auto print:p-0 print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrderForSlip(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 print:hidden"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Slip Header */}
            <div className="border-b-2 border-stone-900 pb-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded bg-black p-0.5 shrink-0">
                  <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-widest font-display">OMED® TUNISIE</h2>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">Bordereau d'Expédition / CRBT</span>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="font-bold block text-sm">{selectedOrderForSlip.orderId}</span>
                <span className="text-stone-500 text-[11px]">{selectedOrderForSlip.date}</span>
              </div>
            </div>

            {/* Shipper & Consignee */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-stone-200">
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="font-bold text-[10px] uppercase text-stone-400 block mb-1">Expéditeur</span>
                <p className="font-semibold text-stone-900">Maison OMED Tunisie</p>
                <p className="text-stone-600 text-[11px]">Atelier Tunis / Service Logistique</p>
                <p className="text-stone-600 text-[11px] font-mono">Tél : +216 71 889 000</p>
              </div>

              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="font-bold text-[10px] uppercase text-stone-400 block mb-1">Destinataire (Client)</span>
                <p className="font-bold text-stone-900">{selectedOrderForSlip.shippingDetails.fullName}</p>
                <p className="text-stone-800 text-[11px] font-semibold font-mono">
                  Tél : {selectedOrderForSlip.customerPhone || selectedOrderForSlip.shippingDetails.orderNotes?.match(/\+?216\s?[0-9\s]+/)?.[0]}
                </p>
                <p className="text-stone-600 text-[11px] mt-0.5">{selectedOrderForSlip.shippingDetails.address}</p>
                <p className="text-stone-600 text-[11px] font-medium">{selectedOrderForSlip.shippingDetails.city}</p>
              </div>
            </div>

            {/* Package Contents */}
            <div className="py-3 text-xs border-b border-stone-200">
              <span className="font-bold text-[10px] uppercase text-stone-400 block mb-1.5">Contenu du Colis</span>
              <ul className="space-y-1">
                {selectedOrderForSlip.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>
                      <strong className="font-mono">{it.quantity}×</strong> {it.product.name}
                      {it.selectedVariant ? ` (${it.selectedVariant.name})` : ''}
                    </span>
                    <span className="font-mono">{formatPrice((it.product.price + (it.selectedVariant?.extraPrice || 0)) * it.quantity, currency)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CRBT Cash Collection Box */}
            <div className="my-4 p-3 bg-stone-100 rounded border-2 border-stone-900 text-center">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-600 block">
                Montant CRBT à Encaisser par le Livreur :
              </span>
              <span className="text-2xl font-black font-mono tracking-tight text-stone-950 block mt-0.5">
                {formatPrice(selectedOrderForSlip.total, currency)}
              </span>
              <span className="text-[10px] text-stone-500 block">
                Mode de paiement : Espèces à la livraison · Colis vérifiable à réception
              </span>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-[10px] text-stone-500">
              <div className="h-14 border border-dashed border-stone-300 rounded p-1 flex flex-col justify-between">
                <span>Signature Livreur :</span>
              </div>
              <div className="h-14 border border-dashed border-stone-300 rounded p-1 flex flex-col justify-between">
                <span>Signature & Date Client :</span>
              </div>
            </div>

            {/* Print CTA */}
            <div className="mt-5 flex justify-end gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded hover:bg-stone-800 flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer ce Bordereau</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER / MODIFIER UN ARTICLE */}
      <ProductAdminModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={(savedProduct) => {
          if (productToEdit) {
            onUpdateProduct(savedProduct);
          } else {
            onAddProduct(savedProduct);
          }
        }}
        currency={currency}
      />
    </div>
  );
};
