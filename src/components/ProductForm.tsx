"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Package, Tag, DollarSign, List, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
  isLoading?: boolean;
}

const CATEGORIES = ["Smartphones", "Laptops", "Gaming", "Audio", "Cameras", "Accessories"];

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || CATEGORIES[0],
    price: initialData?.price || 0,
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    stock_quantity: initialData?.stock_quantity || 0,
    negotiation_allowed: initialData?.negotiation_allowed ?? true,
    is_active: initialData?.is_active ?? true,
    image_url: initialData?.images?.[0]?.image_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Package size={20} className="text-emerald-500" />
              General Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Product Name</label>
              <input
                type="text"
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="iPhone 15 Pro Max"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Category</label>
                <select
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Price (₦)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Short Description</label>
              <input
                type="text"
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="Brief summary for search results"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <List size={20} className="text-emerald-500" />
              Detailed Description
            </h3>
            <textarea
              rows={6}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
              placeholder="Tell customers everything they need to know..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* Right Column: Inventory & Media */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <ImageIcon size={20} className="text-emerald-500" />
              Product Media
            </h3>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">Image URL</label>
              <input
                type="url"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <p className="text-xs text-neutral-500 mt-2 italic">Simple URL-based upload for Sprint 2</p>
            </div>
            {formData.image_url && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-neutral-800">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Tag size={20} className="text-emerald-500" />
              Inventory & Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Available Stock</p>
                <p className="text-xs text-neutral-500">Current units in hand</p>
              </div>
              <input
                type="number"
                className="w-24 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-center"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Negotiation Allowed</p>
                <p className="text-xs text-neutral-500">Can buyers make offers?</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, negotiation_allowed: !formData.negotiation_allowed })}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.negotiation_allowed ? 'bg-emerald-600' : 'bg-neutral-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.negotiation_allowed ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Product Status</p>
                <p className="text-xs text-neutral-500">Visible to public?</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_active ? 'bg-emerald-600' : 'bg-neutral-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_active ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : (
                <>
                  <CheckCircle2 size={20} />
                  {initialData ? "Update Product" : "Publish Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
