
export type GuardType = 'Privacy' | 'Blue Light' | 'Self-Healing';

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: GuardType;
  basePrice: number;
  description: string;
  features: string[];
  imageUrl: string;
  stock: Record<string, number>; // screenSize: quantity
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  type: GuardType;
  screenSize: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface BrandScreenSizes {
  brand: string;
  screenSizes: string[];
}
