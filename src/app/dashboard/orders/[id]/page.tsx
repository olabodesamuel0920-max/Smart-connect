"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { MOCK_ORDERS, MOCK_ORDER_ITEMS, MOCK_PRODUCTS, MOCK_STORES } from "@/lib/mock-data";
import { ChevronLeft, Package, MapPin, Truck, ShieldCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const order = MOCK_ORDERS.find(o => o.id === id);
  const items = MOCK_ORDER_ITEMS.filter(item => item.order_id === id);
  const store = order ? MOCK_STORES.find(s => s.id === order.store_id) : null;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order not found</h1>
          <Link href="/dashboard/orders" className="text-emerald-500 font-bold">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={24} className="text-neutral-500" />;
      case 'paid': return <ShieldCheck size={24} className="text-emerald-500" />;
      case 'processing': return <Package size={24} className="text-blue-500" />;
      case 'delivered': return <Truck size={24} className="text-purple-500" />;
      case 'completed': return <CheckCircle2 size={24} className="text-emerald-500" />;
      case 'cancelled': return <AlertCircle size={24} className="text-red-500" />;
      default: return <Package size={24} className="text-neutral-500" />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="customer" active="/dashboard/orders" />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard/orders" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Order #{order.id.slice(0, 8)}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}>
                  {order.status}
                </span>
              </div>
              <p className="text-neutral-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
            </div>
            
            {order.status === 'delivered' && (
              <button className="btn-primary">Confirm Receipt</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Items */}
              <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Package size={20} className="text-emerald-500" />
                  Order Items
                </h2>
                <div className="space-y-6">
                  {items.map((item) => {
                    const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shrink-0">
                          <img src={product?.product_images?.[0]?.image_url} alt={product?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold">{product?.name}</h3>
                          <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₦{item.subtotal.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500">₦{item.unit_price.toLocaleString()} each</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-8 border-t border-neutral-900 space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>₦{order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery</span>
                    <span className="text-emerald-500">Free</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl pt-4">
                    <span>Total</span>
                    <span>₦{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-emerald-500" />
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">Address</p>
                    <p className="text-white">{order.delivery_address}</p>
                  </div>
                  {order.delivery_note && (
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">Note</p>
                      <p className="text-white">{order.delivery_note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Status Timeline (Simplified) */}
              <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">Status</h2>
                <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="text-white font-bold capitalize">{order.status}</p>
                    <p className="text-xs text-neutral-500">Last updated {new Date(order.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="glass-panel p-8 rounded-3xl border-emerald-500/10">
                <h3 className="font-bold text-white mb-4">Need help?</h3>
                <p className="text-sm text-neutral-400 mb-6">If there's an issue with your order, please contact our support team.</p>
                <button className="w-full bg-neutral-900 border border-neutral-800 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
