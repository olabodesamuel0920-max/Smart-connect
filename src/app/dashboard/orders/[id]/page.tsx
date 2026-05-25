import { requireRole } from "@/lib/server-auth";
import OrderDetailsClient from "./OrderDetailsClient";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(['customer']);
  
  const admin = getSupabaseAdmin();
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (orderError || !order || order.customer_id !== profile.id) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border-red-500/10">
          <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
          <p className="text-neutral-400 mb-6 font-medium">
            We couldn't locate this order, or you do not have permission to view it.
          </p>
          <a href="/dashboard/orders" className="btn-primary inline-block">
            Back to My Orders
          </a>
        </div>
      </div>
    );
  }

  const { data: itemsData } = await admin
    .from("order_items")
    .select("*, product:products(*)")
    .eq("order_id", params.id);

  const items = itemsData || [];

  let store = null;
  if (order.store_id) {
    const { data: storeData } = await admin
      .from("stores")
      .select("*")
      .eq("id", order.store_id)
      .maybeSingle();
    store = storeData;
  }

  return <OrderDetailsClient order={order} items={items} store={store} />;
}
