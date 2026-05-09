"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ChevronLeft, Package, MapPin, Truck, ShieldCheck, Clock, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/orders";

export default function SellerOrderDetailPage({ order, items }: { order: any, items: any[] }) {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [updating, setUpdating] = useState(false);


  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order not found</h1>
          <Link href="/seller/orders" className="text-emerald-500 font-bold">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    const res = await updateOrderStatus(order.id, status as any);
    if (res.success) {
      // In a real app, revalidatePath would handle this, but with mocks we just refresh
      window.location.reload();
    } else {
      alert("Failed to update status: " + res.error);
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller/orders" />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/seller/orders" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Store Orders
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Order #{order.id.slice(0, 8)}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}>
                  {order.status}
                </span>
              </div>
              <p className="text-neutral-500">Customer ID: {order.customer_id}</p>
            </div>
            
            <div className="flex gap-3">
              {order.status === 'paid' && (
                <button 
                  onClick={() => handleUpdateStatus('processing')}
                  disabled={updating}
                  className="btn-primary flex items-center gap-2"
                >
                  {updating ? <RefreshCcw size={18} className="animate-spin" /> : <Package size={18} />}
                  Mark as Processing
                </button>
              )}
              {order.status === 'processing' && (
                <button 
                  onClick={() => handleUpdateStatus('delivered')}
                  disabled={updating}
                  className="btn-primary flex items-center gap-2"
                >
                  {updating ? <RefreshCcw size={18} className="animate-spin" /> : <Truck size={18} />}
                  Mark as Delivered
                </button>
              )}
            </div>
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
                    const product = item.product;
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
              {/* Payout Summary */}
              <div className="glass-panel p-8 rounded-3xl border-emerald-500/10">
                <h2 className="text-xl font-bold text-white mb-6">Financials</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Order Total</span>
                    <span>₦{order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Platform Fee (7.5%)</span>
                    <span className="text-red-400">-₦{(order.total_amount * 0.075).toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-800 flex justify-between text-white font-bold">
                    <span>Net Receivable</span>
                    <span className="text-emerald-500">₦{(order.total_amount * 0.925).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-neutral-900 rounded-xl text-xs text-neutral-500 leading-relaxed">
                  <ShieldCheck size={14} className="text-emerald-500 inline mr-1 mb-1" />
                  Funds are currently <b>Held by Smart Connect</b> (Protected Payment). They will be releasable once the customer confirms delivery or 7 days after delivery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
