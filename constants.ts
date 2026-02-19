
import { Product, BrandModels } from './types';

export const BRANDS: BrandModels[] = [
  { brand: 'Apple', models: ['MacBook Air 13" (M2/M3)', 'MacBook Pro 14"', 'MacBook Pro 16"', 'MacBook Air 15"'] },
  { brand: 'Dell', models: ['XPS 13', 'XPS 15', 'XPS 17', 'Latitude 5440'] },
  { brand: 'HP', models: ['Spectre x360 14', 'Envy x360 15', 'EliteBook 840 G10'] },
  { brand: 'Lenovo', models: ['ThinkPad X1 Carbon Gen 11', 'Yoga 9i', 'Legion 5 Pro'] }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Stealth Privacy Guard (Apple)',
    brand: 'Apple',
    type: 'Privacy',
    basePrice: 1299,
    description: 'Narrow 30-degree viewing angle ensures your confidential spreadsheets and emails stay private in coffee shops and offices.',
    features: ['Micro-louver technology', 'Reduces Glare', 'Easy Magnetic Attachment'],
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    stock: { 'MacBook Pro 14"': 25, 'MacBook Pro 16"': 10 }
  },
  {
    id: 'p2',
    name: 'Eyesafe Blue Light (Apple)',
    brand: 'Apple',
    type: 'Blue Light',
    basePrice: 999,
    description: 'Designed for professionals spending 8+ hours on screen. Filters high-energy blue light without turning your screen yellow.',
    features: ['HEV Blue Light Filter', 'Color-Balanced Pro', 'Anti-Fingerprint'],
    imageUrl: 'https://images.unsplash.com/photo-1541806757-45280114b02c?auto=format&fit=crop&q=80&w=600',
    stock: { 'MacBook Air 13" (M2/M3)': 30, 'MacBook Air 15"': 12 }
  },
  {
    id: 'p3',
    name: 'Armor Self-Healing (Dell)',
    brand: 'Dell',
    type: 'Self-Healing',
    basePrice: 1499,
    description: 'Military-grade polymer that heals key scratches and surface scuffs automatically. Perfect for touchscreen laptops.',
    features: ['Nanotech Healing', 'Touch-Sensitive Optimized', 'Impact Dispersion'],
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600',
    stock: { 'XPS 15': 20, 'XPS 13': 15 }
  }
];
