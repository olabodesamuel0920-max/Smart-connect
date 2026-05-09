import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Package, ChevronRight } from "lucide-react";
import { requireRole } from "@/lib/server-auth";

export default async function CustomerOrdersPage() {
  const profile = await requireRole(['customer']);
  
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

  // Only show orders belonging to this customer
  const userOrders = MOCK_ORDERS.filter(order => order.customer_id === profile.id);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="customer" active="/dashboard/orders" />
      
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
              <p className="text-neutral-400">Track and manage your gadget purchases.</p>
            </div>
          </div>

          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <Link 
                  key={order.id} 
                  href={`/dashboard/orders/${order.id}`}
                  className="block glass-panel p-6 rounded-2xl hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-emerald-500 border border-neutral-800">
                        <Package size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-xs text-neutral-500 mt-1">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-neutral-500 mb-1">Total Amount</p>
                        <p className="text-white font-bold">₦{order.total_amount.toLocaleString()}</p>
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
          ) : (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <Package size={48} className="text-neutral-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
              <p className="text-neutral-400 mb-8">Your gadget purchases will appear here.</p>
              <Link href="/browse" className="btn-primary inline-flex">Browse Gadgets</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

