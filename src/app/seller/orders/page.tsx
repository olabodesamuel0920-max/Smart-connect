import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Package, ChevronRight, Clock, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { requireRole } from "@/lib/server-auth";

export default async function SellerOrdersPage() {
  const profile = await requireRole(['seller']);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-neutral-800 text-neutral-400 border-neutral-700';
      case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'completed': return 'bg-emerald-500 text-white border-emerald-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  // In real app, filter by seller_id
  const sellerOrders = MOCK_ORDERS;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller/orders" />
      
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Store Orders</h1>
              <p className="text-neutral-400">Manage your sales and fulfill orders.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Orders</span>
              </div>
              <p className="text-3xl font-bold text-white">{sellerOrders.length}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-blue-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Clock size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Pending Fulfillment</span>
              </div>
              <p className="text-3xl font-bold text-white">{sellerOrders.filter(o => o.status === 'paid' || o.status === 'processing').length}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-purple-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                  <Truck size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">In Transit</span>
              </div>
              <p className="text-3xl font-bold text-white">{sellerOrders.filter(o => o.status === 'delivered').length}</p>
            </div>
          </div>

          <div className="space-y-4">
            {sellerOrders.map((order) => (
              <Link 
                key={order.id} 
                href={`/seller/orders/${order.id}`}
                className="block glass-panel p-6 rounded-2xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-emerald-500 border border-neutral-800">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-xs text-neutral-500 mt-1">By Customer ID: {order.customer_id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 mb-1">Total Payout (Est.)</p>
                      <p className="text-white font-bold">₦{(order.total_amount * 0.95).toLocaleString()}</p>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>

                    <ChevronRight size={20} className="text-neutral-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
