import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard, { VerificationStatus } from "@/components/SellerGuard";
import { requireRole } from "@/lib/server-auth";

export default async function SellerDashboard() {
  const profile = await requireRole(['seller']);
  
  // Mock status - in a real app, this would come from the database/profile
  const mockStatus: VerificationStatus = 'pending'; 

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller" />
      
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Seller Hub</h1>
            <p className="text-neutral-400">Manage store for {profile.email}</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
            {mockStatus}
          </div>
        </header>

        <SellerGuard status={mockStatus} feature="business">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-white">₦0.00</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Products</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Store Visits</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/20">
              <h3 className="text-sm font-medium text-emerald-500 mb-2">Trust Score</h3>
              <p className="text-3xl font-bold text-emerald-500">N/A</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-2xl h-64 flex items-center justify-center border-dashed">
              <p className="text-neutral-500 italic">Sales analytics chart placeholder</p>
            </div>
            <div className="glass-panel rounded-2xl h-64 flex items-center justify-center border-dashed">
              <p className="text-neutral-500 italic">Recent store activity placeholder</p>
            </div>
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}
