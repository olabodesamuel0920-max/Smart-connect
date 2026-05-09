"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard from "@/components/SellerGuard";
import ProductForm from "@/components/ProductForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/types";

export default function EditProductPage({ product }: { product: Product }) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Verification status check - in a real app would come from profile
  const verificationStatus = 'approved'; 

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

        <SellerGuard status={verificationStatus as any} feature="business">
          <div className="max-w-5xl">
            <ProductForm initialData={product} onSubmit={handleUpdate} isLoading={isLoading} />
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}
