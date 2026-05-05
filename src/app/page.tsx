import Link from 'next/link';
import { ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter((product) => {
    const seller = MOCK_SELLERS.find((s) => s.id === product.seller_profile_id);
    const store = MOCK_STORES.find((s) => s.id === product.store_id);

    return (
      product.is_active &&
      seller?.verification_status === 'approved' &&
      store?.is_active
    );
  }).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center glass-panel border-x-0 border-t-0 fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <span className="text-white font-bold">SC</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Smart Connect</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-neutral-400 hover:text-white transition-colors font-medium"
          >
            Log in
          </Link>
          <Link href="/signup/buyer" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShieldCheck size={18} />
            Nigeria&apos;s Most Trusted Gadget Marketplace
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Premium Gadgets.
            <br />
            <span className="text-emerald-500">Zero Compromise.</span>
          </h1>

          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            A premium trust-based marketplace connecting verified sellers with
            discerning buyers. Every gadget is vetted, every seller is approved,
            and every transaction is protected.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-semibold transition-colors">
              Start Shopping
            </Link>
            <Link
              href="/signup/seller"
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 rounded-2xl font-semibold transition-colors"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Gadgets</h2>
              <p className="text-neutral-400">
                Hand-picked premium listings from our verified sellers
              </p>
            </div>

            <Link
              href="/browse"
              className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              Browse All <Award size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const store =
                MOCK_STORES.find((s) => s.id === product.store_id)?.name ||
                'Unknown Store';

              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price.toLocaleString()}
                  category={product.category}
                  slug={product.slug}
                  imageUrl={product.product_images?.[0]?.image_url || ''}
                  storeName={store}
                  isVerified={true}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Verified Sellers',
              desc: 'Every seller undergoes a rigorous verification process.',
              Icon: Award,
            },
            {
              title: 'Escrow Protection',
              desc: 'Funds are only released once you confirm receipt.',
              Icon: ShieldCheck,
            },
            {
              title: 'Fast Delivery',
              desc: 'Speedy and secure shipping for all gadgets.',
              Icon: Truck,
            },
          ].map(({ title, desc, Icon }, i) => (
            <div
              key={i}
              className="glass-panel p-8 rounded-3xl border border-emerald-500/5 hover:border-emerald-500/20 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="text-emerald-500 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Process */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-neutral-900 text-emerald-500 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock size={16} />
              Protected Buying Flow
            </div>
            <h2 className="text-3xl font-bold mb-3">How Smart Connect Works</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Buy safely from trusted sellers with payment protection built into the process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              'Browse approved listings',
              'Choose your preferred gadget',
              'Pay securely through the platform',
              'Confirm delivery before payout release',
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mb-4">
                  {i + 1}
                </div>
                <p className="text-neutral-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto p-12 border-t border-neutral-900 text-center">
        <p className="text-neutral-500 text-sm">
          © 2024 Smart Connect. Built for trust and excellence.
        </p>
      </footer>
    </div>
  );
}
