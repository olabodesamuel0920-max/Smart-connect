import { requireRole, checkOwnership } from "@/lib/server-auth";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import EditProductClient from "./EditProductClient";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(['seller']);
  
  const product = MOCK_PRODUCTS.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  // Ensure this seller owns the product
  await checkOwnership(product.seller_profile_id, profile.id);

  return <EditProductClient product={product} />;
}
