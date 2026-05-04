import { Product, Store, SellerProfile } from "@/types";

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: "seller-1",
    business_name: "Gadget Hub Nigeria",
    bio: "Premium smartphones and accessories.",
    verification_status: "approved",
  },
  {
    id: "seller-2",
    business_name: "Tech Haven",
    bio: "Next-gen laptops and gaming gear.",
    verification_status: "pending",
  }
];

export const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    seller_id: "seller-1",
    name: "Gadget Hub",
    slug: "gadget-hub",
    description: "The best gadget store in Lagos.",
    is_active: true,
  },
  {
    id: "store-2",
    seller_id: "seller-2",
    name: "Tech Haven",
    slug: "tech-haven",
    description: "Premium tech for everyone.",
    is_active: true,
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    seller_profile_id: "seller-1",
    store_id: "store-1",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    category: "Smartphones",
    price: 1250000,
    short_description: "Titanium design, A17 Pro chip.",
    description: "The most powerful iPhone ever with a titanium design and the A17 Pro chip.",
    stock_quantity: 10,
    negotiation_allowed: true,
    is_active: true,
    product_images: [
      {
        image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
        is_primary: true
      }
    ]
  },
  {
    id: "prod-2",
    seller_profile_id: "seller-1",
    store_id: "store-1",
    name: "MacBook Pro 14 M3",
    slug: "macbook-pro-14-m3",
    category: "Laptops",
    price: 1850000,
    short_description: "The most advanced chips for personal computers.",
    description: "The 14-inch MacBook Pro with M3, M3 Pro, and M3 Max chips.",
    stock_quantity: 5,
    negotiation_allowed: false,
    is_active: true,
    product_images: [
      {
        image_url: "https://images.unsplash.com/photo-1517336714460-4c50d9178051?auto=format&fit=crop&q=80&w=800",
        is_primary: true
      }
    ]
  },
  {
    id: "prod-3",
    seller_profile_id: "seller-2", // Pending seller
    store_id: "store-2",
    name: "PS5 Console",
    slug: "ps5-console",
    category: "Gaming",
    price: 650000,
    short_description: "Next-gen gaming experience.",
    description: "PlayStation 5 Console with ultra-high speed SSD.",
    stock_quantity: 3,
    negotiation_allowed: true,
    is_active: true,
    product_images: [
      {
        image_url: "https://images.unsplash.com/photo-1606813907291-d86ebb9954ad?auto=format&fit=crop&q=80&w=800",
        is_primary: true
      }
    ]
  }
];
