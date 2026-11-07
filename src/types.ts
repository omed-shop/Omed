export type ProductCategory = 'all' | 'textiles';

export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
  extraPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'textiles';
  categoryLabel: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  secondaryImage?: string;
  description: string;
  story: string;
  materials: string[];
  dimensions: string;
  origin: string;
  inStock: boolean;
  stockCount: number;
  badge?: string; // e.g. "Limited Edition", "Archival Reissue"
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'apple_pay' | 'cod';
  orderNotes?: string;
}

export type OrderStatus = 'nouvelle' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

export interface ConfirmedOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingDetails: ShippingDetails;
  status: OrderStatus;
  customerPhone?: string;
  createdAt: string;
}
