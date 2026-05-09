import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard from "@/components/SellerGuard";
import { MOCK_PRODUCTS, MOCK_SELLERS } from "@/lib/mock-data";
import { Plus, Edit2, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/server-auth";

export default async function SellerProductsPage() {
  const profile = await requireRole(['seller']);
  
  // Find the seller profile associated with the authenticated user
  const currentSeller = MOCK_SELLERS.find(s => s.id === profile.id) || MOCK_SELLERS[0]; 
  const sellerProducts = MOCK_PRODUCTS.filter(p => p.seller_profile_id === currentSeller.id);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller/products" />
      
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">My Products</h1>
            <p className="text-neutral-400">Manage your gadget listings and stock</p>
          </div>
          
          <SellerGuard status={currentSeller.verification_status as any} feature="business">
            <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add Product
            </Link>
          </SellerGuard>
        </header>

        <SellerGuard status={currentSeller.verification_status as any} feature="business">
          <div className="glass-panel rounded-2xl overflow-hidden border-neutral-800/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Product</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {sellerProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                            {product.product_images?.[0] ? (
                              <img src={product.product_images?.[0].image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-bold group-hover:text-emerald-400 transition-colors">{product.name}</p>
                            <p className="text-xs text-neutral-500 truncate max-w-[200px]">{product.short_description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-300">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-mono">₦{product.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${product.stock_quantity > 0 ? 'text-neutral-300' : 'text-red-500 font-bold'}`}>
                           {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          product.is_active 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                        }`}>
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/products/${product.slug}`}
                            className="p-2 text-neutral-500 hover:text-white transition-colors"
                            title="View Publicly"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <Link 
                            href={`/seller/products/${product.id}/edit`}
                            className="p-2 text-neutral-500 hover:text-emerald-500 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sellerProducts.length === 0 && (
              <div className="p-12 text-center">
                <Package className="mx-auto text-neutral-700 mb-4" size={48} />
                <h3 className="text-lg font-bold text-white mb-1">No products yet</h3>
                <p className="text-neutral-500 mb-6">Start listing your gadgets to reach thousands of buyers.</p>
                <Link href="/seller/products/new" className="btn-primary inline-flex">Add Your First Product</Link>
              </div>
            )}
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}