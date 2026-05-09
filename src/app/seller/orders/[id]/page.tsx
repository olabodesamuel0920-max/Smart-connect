import { requireRole, checkOwnership } from "@/lib/server-auth";
import { MOCK_ORDERS, MOCK_ORDER_ITEMS, MOCK_PRODUCTS } from "@/lib/mock-data";
import OrderDetailsClient from "./OrderDetailsClient";
import { notFound } from "next/navigation";

export default async function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(['seller']);
  
  const order = MOCK_ORDERS.find(o => o.id === params.id);
  
  if (!order) {
    notFound();
  }

  // Ensure this seller owns the order
  await checkOwnership(order.seller_profile_id, profile.id);

  const items = MOCK_ORDER_ITEMS
    .filter(item => item.order_id === params.id)
    .map(item => ({
      ...item,
      product: MOCK_PRODUCTS.find(p => p.id === item.product_id)
    }));

  return <OrderDetailsClient order={order} items={items} />;
}
