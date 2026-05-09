import DashboardSidebar from "@/components/DashboardSidebar";
import { requireRole } from "@/lib/server-auth";

export default async function CustomerDashboard() {
  const profile = await requireRole(['customer']);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="customer" active="/dashboard" />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Buyer Dashboard</h1>
          <p className="text-neutral-400">Welcome back, {profile.email}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Active Orders</h3>
            <p className="text-4xl font-bold text-white">0</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Saved Items</h3>
            <p className="text-4xl font-bold text-white">12</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Wallet Balance</h3>
            <p className="text-4xl font-bold text-emerald-500">₦0.00</p>
          </div>
        </div>

        <div className="mt-8 glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h3 className="font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="p-12 text-center">
            <p className="text-neutral-500">No orders found. <span className="text-emerald-500 cursor-pointer">Start shopping</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}
