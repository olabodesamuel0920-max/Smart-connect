import DashboardSidebar from "@/components/DashboardSidebar";
import { CreditCard, Landmark, ShieldCheck, DollarSign } from "lucide-react";
import { requireRole } from "@/lib/server-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function AdminPaymentsPage() {
  await requireRole(['admin']);

  let payments: any[] = [];
  let heldFunds: any[] = [];
  let dbError = false;

  try {
    const admin = getSupabaseAdmin();
    const { data: dbPayments, error: payError } = await admin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: dbHeldFunds, error: fundError } = await admin
      .from("held_funds")
      .select("*")
      .order("created_at", { ascending: false });

    if (payError || fundError) {
      dbError = true;
    } else {
      payments = dbPayments || [];
      heldFunds = dbHeldFunds || [];
    }
  } catch (err) {
    console.error("Failed to fetch admin financial data:", err);
    dbError = true;
  }

  const totalVolume = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalHeld = heldFunds.filter(f => f.status === 'held').reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalCommission = heldFunds.reduce((acc, curr) => acc + curr.commission_amount, 0);
  const totalReleasable = heldFunds.filter(f => f.status === 'releasable').reduce((acc, curr) => acc + curr.seller_receivable, 0);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <DashboardSidebar role="admin" active="/admin/payments" />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Payments & Protected Funds</h1>
            <p className="text-neutral-400">Manage financial transactions and funds held by Smart Connect.</p>
          </div>

          {dbError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
              Warning: Database connection failed. Displaying local empty states.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Volume</span>
              </div>
              <p className="text-2xl font-bold text-white">₦{totalVolume.toLocaleString()}</p>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border-blue-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Held by Smart Connect</span>
              </div>
              <p className="text-2xl font-bold text-white">₦{totalHeld.toLocaleString()}</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-amber-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                  <Landmark size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Releasable Funds</span>
              </div>
              <p className="text-2xl font-bold text-white">₦{totalReleasable.toLocaleString()}</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-purple-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                  <DollarSign size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Commission</span>
              </div>
              <p className="text-2xl font-bold text-white">₦{totalCommission.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Payments */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-500" />
                Recent Payments
              </h2>
              <div className="glass-panel rounded-2xl overflow-hidden border-neutral-800">
                {payments.length > 0 ? (
                  <div className="divide-y divide-neutral-900">
                    {payments.map((payment) => (
                      <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-all">
                        <div>
                          <p className="text-white font-bold text-sm">₦{payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500 mt-1">Ref: {payment.paystack_reference}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                            {payment.status}
                          </span>
                          <p className="text-[10px] text-neutral-600 mt-1">
                            {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    No payment transactions recorded.
                  </div>
                )}
              </div>
            </div>

            {/* Held Funds */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Landmark size={20} className="text-blue-500" />
                Held Funds Log
              </h2>
              <div className="glass-panel rounded-2xl overflow-hidden border-neutral-800">
                {heldFunds.length > 0 ? (
                  <div className="divide-y divide-neutral-900">
                    {heldFunds.map((fund) => {
                      const isReleasable = fund.status === 'releasable';
                      const isHeld = fund.status === 'held';
                      
                      return (
                        <div key={fund.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-all">
                          <div>
                            <p className="text-white font-bold text-sm">₦{fund.total_amount.toLocaleString()}</p>
                            <p className="text-xs text-neutral-500 mt-1">Seller Receivable: ₦{fund.seller_receivable.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              isReleasable 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : isHeld 
                                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}>
                              {isReleasable ? 'Releasable' : isHeld ? 'Held by Smart Connect' : fund.status}
                            </span>
                            <p className="text-[10px] text-neutral-600 mt-1">Comm (7.5%): ₦{fund.commission_amount.toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-sm">
                    No held funds records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
