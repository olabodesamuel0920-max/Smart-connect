export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
}

export interface SellerProfile {
  id: string;
  business_name: string;
  bio?: string;
  verification_status: VerificationStatus;
}

export interface Store {
  id: string;
  seller_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  seller_profile_id: string;
  store_id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  short_description?: string;
  description?: string;
  stock_quantity: number;
  negotiation_allowed: boolean;
  is_active: boolean;
  product_images?: { image_url: string; is_primary?: boolean }[];
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'abandoned';
export type HeldFundStatus = 'held' | 'releasable' | 'released' | 'frozen';

export interface Order {
  id: string;
  customer_id: string;
  seller_profile_id: string;
  store_id: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  delivery_note?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  customer_id: string;
  paystack_reference?: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
}

export interface HeldFund {
  id: string;
  order_id: string;
  seller_profile_id: string;
  total_amount: number;
  commission_amount: number;
  seller_receivable: number;
  status: HeldFundStatus;
  created_at: string;
  updated_at: string;
}

