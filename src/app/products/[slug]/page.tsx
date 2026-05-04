"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from "@/lib/mock-data";
import { ShieldCheck, ChevronLeft, Store, MessageSquare, ShoppingCart, Tag, Clock } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  const seller = product ? MOCK_SELLERS.find(s => s.id === product.seller_profile_id) : null;
  const store = product ? MOCK_STORES.find(s => s.id === product.store_id) : null;

  // Security & Visibility check
  const isVisible = product?.is_active && seller?.verification_status === 'approved' && store?.is_active;

  if (!product || !isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gadget Not Found</h1>
          <p className="text-neutral-400 mb-8">The product you are looking for is no longer available or doesn't exist.</p>
          <Link href="/browse" className="btn-primary">Return to Browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center glass-panel border-x-0 border-t-0 fixed w-full z-50 bg-neutral-950/80 backdrop-blur-xl">
        <Link href="/browse" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">SC</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight hidden sm:block">Smart Connect</span>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
              <img 
                src={product.images[0]?.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center text-neutral-700 text-xs uppercase font-bold">
                  Img {i}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/20">
                <Tag size={14} />
                {product.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed mb-6">
                {product.short_description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-white">₦{product.price.toLocaleString()}</span>
                {product.negotiation_allowed && (
                  <span className="bg-neutral-900 text-neutral-400 px-3 py-1 rounded-lg text-xs font-bold border border-neutral-800">
                    NEGOTIABLE
                  </span>
                )}
              </div>
            </div>

            {/* Store Card */}
            <Link 
              href={`/stores/${store?.slug}`}
              className="glass-panel p-6 rounded-2xl mb-8 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-emerald-500 border border-neutral-800">
                    <Store size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{store?.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Verified Seller
                    </div>
                  </div>
                </div>
                <div className="text-emerald-500 font-bold text-sm">View Store</div>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button className="w-full btn-primary py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20">
                <ShoppingCart size={22} />
                Initiate Purchase
              </button>
              <button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all">
                <MessageSquare size={22} />
                Chat with Seller
              </button>
            </div>

            {/* Detailed Info */}
            <div className="border-t border-neutral-900 pt-8 space-y-6">
              <div>
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-emerald-500" />
                  Product Description
                </h4>
                <p className="text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Stock Status</p>
                  <p className="text-white font-bold">{product.stock_quantity > 0 ? `${product.stock_quantity} Units Available` : 'Out of Stock'}</p>
                </div>
                <div className="glass-panel p-4 rounded-xl border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Authenticity</p>
                  <p className="text-emerald-500 font-bold">100% Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto p-12 border-t border-neutral-900 text-center">
        <p className="text-neutral-500 text-sm">
          Protected by Smart Connect Escrow. Funds are safe until you confirm.
        </p>
      </footer>
    </div>
  );
}
