
import { Product, BrandScreenSizes } from './types';

export const BRANDS: BrandScreenSizes[] = [
  { brand: 'Apple', screenSizes: ['13.3"', '13.6"', '14.2"', '15.3"', '16.2"'] },
  { brand: 'Dell', screenSizes: ['13.3"', '13.4"', '14.0"', '15.6"', '16.0"', '17.0"'] },
  { brand: 'HP', screenSizes: ['13.3"', '13.5"', '14.0"', '15.6"', '16.0"', '17.3"'] },
  { brand: 'Lenovo', screenSizes: ['13.3"', '14.0"', '14.5"', '15.6"', '16.0"'] },
  { brand: 'Asus', screenSizes: ['13.3"', '14.0"', '15.6"', '16.0"', '17.3"'] },
  { brand: 'Acer', screenSizes: ['13.3"', '14.0"', '15.6"', '16.0"', '17.3"'] },
  { brand: 'Microsoft', screenSizes: ['12.4"', '13.5"', '14.4"', '15.0"'] }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Stealth Privacy Guard',
    brand: 'Apple',
    type: 'Privacy',
    basePrice: 1299,
    description: 'Narrow 30-degree viewing angle ensures your confidential spreadsheets and emails stay private in coffee shops and offices.',
    features: ['Micro-louver technology', 'Reduces Glare', 'Easy Magnetic Attachment'],
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    stock: { '14.2"': 25, '16.2"': 10 }
  },
  {
    id: 'p2',
    name: 'Eyesafe Blue Light',
    brand: 'Apple',
    type: 'Blue Light',
    basePrice: 999,
    description: 'Designed for professionals spending 8+ hours on screen. Filters high-energy blue light without turning your screen yellow.',
    features: ['HEV Blue Light Filter', 'Color-Balanced Pro', 'Anti-Fingerprint'],
    imageUrl: 'https://images.unsplash.com/photo-1541806757-45280114b02c?auto=format&fit=crop&q=80&w=600',
    stock: { '13.3"': 30, '15.3"': 12 }
  },
  {
    id: 'p3',
    name: 'Armor Self-Healing',
    brand: 'Dell',
    type: 'Self-Healing',
    basePrice: 1499,
    description: 'Military-grade polymer that heals key scratches and surface scuffs automatically. Perfect for touchscreen laptops.',
    features: ['Nanotech Healing', 'Touch-Sensitive Optimized', 'Impact Dispersion'],
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600',
    stock: { '15.6"': 20, '13.4"': 15 }
  }
];
