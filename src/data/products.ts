import { Product, ProductCategory } from '../types';

export const BRAND_LOGO = '/assets/aistudio/IMG_20261107_191604_553_494d51f2.jpg';
export const HERO_IMAGE = '/src/assets/images/hero_omed_campaign_1794074822506.jpg';

// Ready for production: Clean catalog with 0 test products.
// Real articles are added, edited, or removed directly from the private dashboard.
export const PRODUCTS: Product[] = [];

export const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'textiles', label: 'Textiles' },
];

export const REVIEWS: any[] = [];
