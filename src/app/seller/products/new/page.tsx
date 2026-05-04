"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard from "@/components/SellerGuard";
import ProductForm from "@/components/ProductForm";
import { MOCK_SELLERS } from "@/lib/mock-data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock current user
  const currentSeller = MOCK_SELLERS[0]; 

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    console.log("Creating product:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    router.push("/seller/products");
  };

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
          <h1 className="text-3xl font-bold text-white tracking-tight">List New Gadget</h1>
          <p className="text-neutral-400">Add a new premium gadget to your store</p>
        </header>

        <SellerGuard status={currentSeller.verification_status} feature="business">
          <div className="max-w-5xl">
            <ProductForm onSubmit={handleCreate} isLoading={isLoading} />
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}