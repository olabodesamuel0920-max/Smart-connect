"use client";

import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { MOCK_ORDERS, MOCK_STORES, MOCK_SELLERS } from "@/lib/mock-data";
import { Search, Filter, ExternalLink, Package } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="admin" active="/admin/orders" />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Global Orders</h1>
              <p className="text-neutral-400">Monitoring all transactions on Smart Connect.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search orders..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <button className="bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-neutral-400 hover:text-white transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border-neutral-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-neutral-800">
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Store</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {MOCK_ORDERS.map((order) => {
                  const store = MOCK_STORES.find(s => s.id === order.store_id);
                  return (
                    <tr key={order.id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-medium font-mono text-sm">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-300 text-sm">{store?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-bold text-sm">₦{order.total_amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                          order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          'bg-neutral-800 text-neutral-500 border-neutral-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-emerald-500 hover:text-emerald-400 transition-colors">
                          <ExternalLink size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {MOCK_ORDERS.length === 0 && (
              <div className="py-20 text-center">
                <Package size={40} className="text-neutral-800 mx-auto mb-4" />
                <p className="text-neutral-500">No orders found in the system.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
