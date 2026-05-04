'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import {
  ChevronLeft,
  Store,
  ShieldCheck,
  MapPin,
  Award,
} from 'lucide-react';

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const store = MOCK_STORES.find((s) => s.slug === slug);
  const seller = store
    ? MOCK_SELLERS.find((s) => s.id === store.seller_id)
    : null;

  const isVisible =
    !!store &&
    !!seller &&
    store.is_active &&
    seller.verification_status === 'approved';

  const storeProducts = isVisible
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.store_id === store.id &&
          p.is_active &&
          seller?.verification_status === 'approved'
      )
    : [];

  if (!store || !isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Store Not Found</h1>
          <p className="text-neutral-400 mb-6">
            This store is currently unavailable or does not exist.
          </p>
          <Link href="/browse" className="btn-primary">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <nav className="p-6 fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Browse</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Store className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Smart Connect</span>
          </div>
        </div>
      </nav>

      <section className="relative pt-28">
        <div className="h-64 md:h-80 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-emerald-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-950 rounded-3xl border-4 border-neutral-900 flex items-center justify-center text-emerald-500 shadow-2xl">
              <Store className="h-12 w-12 md:h-16 md:w-16" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {store.name}
                </h1>

                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
                  <ShieldCheck size={14} />
                  Verified Store
                </div>
              </div>

              <p className="text-neutral-400 max-w-2xl">{store.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-300 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500" />
                  <span>Trusted seller storefront</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award size={16} className="text-emerald-500" />
                  <span>Protected marketplace listing</span>
                </div>
              </div>
            </div>

            <div className="hidden md:grid gap-4 md:w-72">
              <div className="glass-panel rounded-3xl border border-neutral-800 p-5 text-center">
                <p className="text-2xl font-bold">{storeProducts.length}</p>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-[0.2em]">
                  Products
                </p>
              </div>

              <div className="glass-panel rounded-3xl border border-neutral-800 p-5 text-center">
                <p className="text-2xl font-bold text-emerald-500">4.9</p>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-[0.2em]">
                  Trust Score
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex flex-wrap gap-4 mb-12 border-b border-neutral-900 pb-6">
          <button className="text-white font-medium border-b-2 border-emerald-500 pb-2 px-4">
            All Gadgets
          </button>
          <button className="text-neutral-400 font-medium hover:text-white transition-colors pb-2 px-4">
            About Store
          </button>
          <button className="text-neutral-400 font-medium hover:text-white transition-colors pb-2 px-4">
            Reviews
          </button>
        </div>

        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price.toLocaleString()}
                category={product.category}
                slug={product.slug}
                imageUrl={product.product_images?.[0]?.image_url || ''}
                storeName={store.name}
                isVerified
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Award className="mx-auto text-neutral-700 mb-4 h-12 w-12" />
            <h3 className="text-xl font-bold text-white mb-2">No active listings</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              This store does not have any active gadget listings at the moment.
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
