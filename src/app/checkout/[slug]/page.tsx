"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { MOCK_PRODUCTS, MOCK_STORES } from "@/lib/mock-data";
import { ShieldCheck, Lock, ChevronLeft, MapPin, Truck, AlertCircle } from "lucide-react";
import { createPendingOrder, verifyPayment } from "@/app/actions/orders";

declare var PaystackPop: any;

export default function CheckoutPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  const store = product ? MOCK_STORES.find(s => s.id === product.store_id) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/browse" className="text-emerald-500 font-bold">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please provide a delivery address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Pending Order
      const res = await createPendingOrder({
        customer_id: "mock-customer-id", // In real app, get from auth
        seller_profile_id: product.seller_profile_id,
        store_id: product.store_id,
        total_amount: product.price,
        delivery_address: address,
        delivery_note: note,
        items: [{
          product_id: product.id,
          quantity: 1,
          unit_price: product.price,
          subtotal: product.price
        }]
      });

      if (!res.success || !res.orderId) {
        throw new Error(res.error || "Failed to initiate order");
      }

      // 2. Initialize Paystack
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: "customer@example.com", // In real app, get from auth
        amount: product.price * 100, // in kobo
        currency: "NGN",
        ref: `SC-${res.orderId}-${Date.now()}`,
        metadata: {
          order_id: res.orderId,
          custom_fields: [
            { display_name: "Product", variable_name: "product", value: product.name },
            { display_name: "Order ID", variable_name: "order_id", value: res.orderId }
          ]
        },
        callback: async (response: any) => {
          // 3. Verify Payment Server-Side
          const verification = await verifyPayment(response.reference, res.orderId!);
          if (verification.success) {
            router.push(`/dashboard/orders/${res.orderId}?status=success`);
          } else {
            setError("Payment verification failed. Please contact support.");
            setLoading(false);
          }
        },
        onClose: () => {
          setLoading(false);
          setError("Payment cancelled. Your order is pending.");
        }
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pb-20">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      
      <nav className="p-6 glass-panel border-x-0 border-t-0 flex items-center justify-between bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href={`/products/${slug}`} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-500" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">Secure Checkout</span>
        </div>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Side */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Delivery Details</h1>
              <p className="text-neutral-400">Where should we send your gadget?</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" />
                    Delivery Address
                  </label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="Enter full address, including landmarks..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <Truck size={16} className="text-neutral-500" />
                    Delivery Note (Optional)
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="E.g. Call me before arrival"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="glass-panel p-6 rounded-2xl border-emerald-500/10 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Smart Connect Escrow</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Your funds are held securely. The seller only receives payment after you confirm delivery.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ₦{product.price.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Side */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="glass-panel p-8 rounded-3xl border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-8">
                <div className="w-20 h-20 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shrink-0">
                  <img 
                    src={product.product_images?.[0]?.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{product.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1">From {store?.name}</p>
                  <p className="text-emerald-500 font-bold mt-2">₦{product.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-neutral-900 pt-6">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>₦{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery</span>
                  <span className="text-emerald-500">Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-neutral-900">
                  <span>Total</span>
                  <span>₦{product.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-neutral-500 text-xs uppercase tracking-widest font-bold">
                <Lock size={12} />
                Encrypted Payment
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
