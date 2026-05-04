import Link from "next/link";
import { ShieldCheck, Truck, Clock, Award } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center glass-panel border-x-0 border-t-0 fixed w-full z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <span className="text-white font-bold">SC</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Smart Connect</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-neutral-400 hover:text-white transition-colors font-medium">Log in</Link>
          <Link href="/signup/buyer" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-emerald-500/20">
            <ShieldCheck size={18} />
            Nigeria's Most Trusted Gadget Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter leading-tight">
            Premium Gadgets. <br />
            <span className="text-emerald-500">Zero Compromise.</span>
          </h1>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            A premium trust-based marketplace connecting verified sellers with discerning buyers. Every gadget is vetted for quality and authenticity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/40">
              Start Shopping
            </Link>
            <Link href="/signup/seller" className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 rounded-2xl font-bold text-lg transition-all">
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
              <p className="text-neutral-400">Hand-picked premium listings from our verified sellers</p>
            </div>
            <Link href="/browse" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors flex items-center gap-2">
              Browse All <Award size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PRODUCTS
              .filter(p => {
                const seller = MOCK_SELLERS.find(s => s.id === p.seller_profile_id);
                const store = MOCK_STORES.find(s => s.id === p.store_id);
                return p.is_active && seller?.verification_status === 'approved' && store?.is_active;
              })
              .slice(0, 4)
              .map(product => (
                <ProductCard 
                  key={product.id}
                  name={product.name}
                  price={product.price.toLocaleString()}
                  category={product.category}
                  slug={product.slug}
                  imageUrl={product.images[0]?.image_url}
                  storeName={MOCK_STORES.find(s => s.id === product.store_id)?.name || "Unknown Store"}
                  isVerified={true}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Verified Sellers", desc: "Every seller undergoes a rigorous verification process.", icon: Award },
            { title: "Escrow Protection", desc: "Funds are only released once you confirm receipt.", icon: ShieldCheck },
            { title: "Fast Delivery", desc: "Swift and secure shipping for all gadgets.", icon: Truck }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border-emerald-500/5 hover:border-emerald-500/20 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
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
