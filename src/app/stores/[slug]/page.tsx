"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";
import { ShieldCheck, ChevronLeft, Store, MapPin, Calendar, Award } from "lucide-react";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const store = MOCK_STORES.find(s => s.slug === slug);
  const seller = store ? MOCK_SELLERS.find(s => s.id === store.seller_id) : null;
  
  // Visibility check
  const isVisible = store?.is_active && seller?.verification_status === 'approved';

  const storeProducts = MOCK_PRODUCTS.filter(p => 
    p.store_id === store?.id && 
    p.is_active && 
    seller?.verification_status === 'approved'
  );

  if (!store || !isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Store Not Found</h1>
          <p className="text-neutral-400 mb-8">This store is currently unavailable or doesn't exist.</p>
          <Link href="/browse" className="btn-primary">Back to Browse</Link>
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

      {/* Store Banner */}
      <div className="h-64 md:h-80 bg-neutral-900 w-full relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-950 rounded-3xl border-4 border-neutral-900 flex items-center justify-center text-emerald-500 shadow-2xl">
              <Store size={48} md:size={64} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{store.name}</h1>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20 self-center md:self-auto">
                  <ShieldCheck size={14} />
                  Verified Store
                </div>
              </div>
              <p className="text-neutral-400 max-w-2xl">{store.description}</p>
            </div>
            <div className="hidden lg:flex gap-4 mb-2">
              <div className="text-center px-6 border-r border-neutral-800">
                <p className="text-2xl font-bold text-white">{storeProducts.length}</p>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Products</p>
              </div>
              <div className="text-center px-6">
                <p className="text-2xl font-bold text-emerald-500">4.9</p>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Trust Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex items-center gap-4 mb-12 border-b border-neutral-900 pb-6">
          <button className="text-white font-bold border-b-2 border-emerald-500 pb-6 px-4 -mb-6.5">All Gadgets</button>
          <button className="text-neutral-500 font-medium hover:text-white transition-colors pb-6 px-4">About Store</button>
          <button className="text-neutral-500 font-medium hover:text-white transition-colors pb-6 px-4">Reviews</button>
        </div>

        {/* Store Products Grid */}
        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeProducts.map(product => (
              <ProductCard 
                key={product.id}
                name={product.name}
                price={product.price.toLocaleString()}
                category={product.category}
                slug={product.slug}
                imageUrl={product.images[0]?.image_url}
                storeName={store.name}
                isVerified={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Award className="mx-auto text-neutral-700 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No active listings</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              This store doesn't have any active gadget listings at the moment.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto p-12 border-t border-neutral-900 text-center">
        <p className="text-neutral-500 text-sm">
          Shop with confidence. Every seller in this store is verified by Smart Connect.
        </p>
      </footer>
    </div>
  );
}
