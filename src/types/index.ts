export type UserRole = 'customer' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  loyaltyPoints: number;
  referralCode: string;
  fcmToken?: string;
  createdAt: any;
}

export type OrderType = 'grocery' | 'laundry' | 'parcel';

export type GroceryStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type LaundryStatus = 'scheduled' | 'picked_up' | 'in_cleaning' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type ParcelStatus = 'booked' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export type OrderStatus = GroceryStatus | LaundryStatus | ParcelStatus;

export interface GroceryItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  unit: string;
}

export interface Order {
  id: string;
  type: OrderType;
  customerId: string;
  status: OrderStatus;
  items?: GroceryItem[];
  deliveryAddress?: string;
  pickupAddress?: string;
  recipientAddress?: string;
  scheduledTime?: any;
  pickupTime?: any;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  estimatedWeight?: number;
  parcelSize?: string;
  adminNotes?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl: string;
  inStock: boolean;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
}

export interface LaundryOrder extends Order {
  type: 'laundry';
  weight?: number;
  pickupTime: any;
  returnTime: any;
  notes?: string;
}

export interface ParcelDelivery extends Order {
  type: 'parcel';
  senderAddress: string;
  recipientAddress: string;
  recipientName: string;
  recipientPhone: string;
  parcelSize: 'Small' | 'Medium' | 'Large';
  weightEstimate?: number;
  notes?: string;
  scheduledPickup: any;
}

export interface LoyaltyHistory {
  points: number;
  reason: string;
  date: any;
}

export interface LoyaltyPoints {
  uid: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  history: LoyaltyHistory[];
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: 'pending' | 'completed';
  rewardGiven: boolean;
  createdAt: any;
}
