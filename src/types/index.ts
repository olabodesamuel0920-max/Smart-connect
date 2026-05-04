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

