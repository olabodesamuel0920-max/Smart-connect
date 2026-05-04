"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard from "@/components/SellerGuard";
import ProductForm from "@/components/ProductForm";
import { MOCK_PRODUCTS, MOCK_SELLERS } from "@/lib/mock-data";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  
  // Mock current user
  const currentSeller = MOCK_SELLERS[0]; 

  useEffect(() => {
    // Mock fetching product
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
    } else {
      router.push("/seller/products");
    }
  }, [id, router]);

  const handleUpdate = async (data: any) => {
    setIsLoading(true);
    console.log("Updating product:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    router.push("/seller/products");
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller/products" />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <Link 
            href="/seller/products" 
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-4 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Product</h1>
          <p className="text-neutral-400">Update your gadget details</p>
        </header>

        <SellerGuard status={currentSeller.verification_status} feature="business">
          <div className="max-w-5xl">
            <ProductForm initialData={product} onSubmit={handleUpdate} isLoading={isLoading} />
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}
