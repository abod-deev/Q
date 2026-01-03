
export type Language = 'en' | 'ar';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  neighborhood?: string;
  deliveryNote?: string;
  label?: 'home' | 'work' | 'other';
}

export interface Neighborhood {
  id: string;
  nameAr: string;
  isActive: boolean;
  baseFee: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  description: string;
  descriptionAr: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  nameAr: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  type: 'restaurant' | 'grocery' | 'pharmacy' | 'express';
  products: Product[];
  lat: number;
  lng: number;
  neighborhood: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export enum OrderStatus {
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY'
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  currentOrderId?: string;
  vehicle: 'motorcycle' | 'car' | 'bicycle';
  totalDistance: number;
  walletBalance: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  status: OrderStatus;
  timestamp: Date;
  customerLocation: Location;
  paymentMethod: 'cash' | 'wallet' | 'card';
  phone: string;
  storeId: string;
  driverId?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  isVerified: boolean;
  wallet: number;
  savedAddresses: Location[];
  orderHistory: Order[];
}
