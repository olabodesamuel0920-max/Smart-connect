"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_STORES } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, Package } from "lucide-react";

const CATEGORIES = ["All", "Smartphones", "Laptops", "Gaming", "Audio", "Cameras", "Accessories"];

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const seller = MOCK_SELLERS.find(s => s.id === p.seller_profile_id);
    const store = MOCK_STORES.find(s => s.id === p.store_id);
    
    // Core requirements: Active product, Approved seller, Active store
    const isVisible = p.is_active && seller?.verification_status === 'approved' && store?.is_active;
    
    if (!isVisible) return false;

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center glass-panel border-x-0 border-t-0 sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">SC</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Smart Connect</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">Log in</Link>
          <Link href="/signup/seller" className="btn-secondary text-sm">Sell Gadgets</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Browse Gadgets</h1>
            <p className="text-neutral-400 text-lg">Premium tech vetted for quality and trust.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input 
                type="text"
                placeholder="Search gadgets..."
                className="w-full sm:w-64 bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-secondary flex items-center gap-2 justify-center">
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-8 no-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                selectedCategory === category 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' 
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
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
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-neutral-800">
              <Package className="text-neutral-700" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No gadgets found</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try adjusting your search or category.
            </p>
            <button 
              onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
              className="mt-8 text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <footer className="mt-auto p-12 border-t border-neutral-900 text-center">
        <p className="text-neutral-500 text-sm">
          © 2024 Smart Connect. Every gadget is verified.
        </p>
      </footer>
    </div>
  );
}
