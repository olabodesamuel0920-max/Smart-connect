import DashboardSidebar from "@/components/DashboardSidebar";
import SellerGuard from "@/components/SellerGuard";
import { MOCK_SELLERS } from "@/lib/mock-data";
import { requireRole } from "@/lib/server-auth";

export default async function SellerStorePage() {
  const profile = await requireRole(['seller']);
  const currentSeller = MOCK_SELLERS.find(s => s.id === profile.id) || MOCK_SELLERS[0];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="seller" active="/seller/store" />
      
      <main className="flex-1 p-8">
        <SellerGuard status={currentSeller.verification_status} feature="onboarding">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Store Profile</h1>
            <p className="text-neutral-400">Manage your public storefront details</p>
          </header>

          <div className="max-w-2xl">
            <form className="space-y-6">
              <div className="glass-panel p-8 rounded-2xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Store Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="Gadget Hub Nigeria"
                    defaultValue="Gadget Hub"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Store Slug (URL)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-neutral-900 border border-r-0 border-neutral-700 rounded-l-lg text-neutral-500 text-sm">
                      smartconnect.com/stores/
                    </span>
                    <input 
                      type="text" 
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-r-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      placeholder="gadget-hub"
                      defaultValue="gadget-hub"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Business Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    placeholder="Tell customers about your business..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center text-neutral-500 overflow-hidden">
                    <span className="text-xs">No Logo</span>
                  </div>
                  <button type="button" className="btn-secondary text-sm">Change Logo</button>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">Save Changes</button>
              </div>
            </form>
          </div>
        </SellerGuard>
      </main>
    </div>
  );
}
