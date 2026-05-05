"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { MOCK_PAYMENTS, MOCK_HELD_FUNDS, MOCK_ORDERS } from "@/lib/mock-data";
import { CreditCard, Landmark, ShieldCheck, ArrowUpRight, DollarSign } from "lucide-react";

export default function AdminPaymentsPage() {
  const totalVolume = MOCK_PAYMENTS.reduce((acc, curr) => acc + curr.amount, 0);
  const totalHeld = MOCK_HELD_FUNDS.filter(f => f.status === 'held').reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalCommission = MOCK_HELD_FUNDS.reduce((acc, curr) => acc + curr.commission_amount, 0);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="admin" active="/admin/payments" />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Payments & Escrow</h1>
            <p className="text-neutral-400">Manage financial transactions and held funds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Volume</span>
              </div>
              <p className="text-3xl font-bold text-white">₦{totalVolume.toLocaleString()}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-blue-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Held (Escrow)</span>
              </div>
              <p className="text-3xl font-bold text-white">₦{totalHeld.toLocaleString()}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-purple-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                  <DollarSign size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-400">Total Commission</span>
              </div>
              <p className="text-3xl font-bold text-white">₦{totalCommission.toLocaleString()}</p>
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
                <div className="divide-y divide-neutral-900">
                  {MOCK_PAYMENTS.map((payment) => (
                    <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-all">
                      <div>
                        <p className="text-white font-bold text-sm">₦{payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500 mt-1">Ref: {payment.paystack_reference}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                          {payment.status}
                        </span>
                        <p className="text-[10px] text-neutral-600 mt-1">{new Date(payment.paid_at!).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Held Funds */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Landmark size={20} className="text-blue-500" />
                Held Funds Log
              </h2>
              <div className="glass-panel rounded-2xl overflow-hidden border-neutral-800">
                <div className="divide-y divide-neutral-900">
                  {MOCK_HELD_FUNDS.map((fund) => (
                    <div key={fund.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-all">
                      <div>
                        <p className="text-white font-bold text-sm">₦{fund.total_amount.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500 mt-1">Seller Receivable: ₦{fund.seller_receivable.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
                          {fund.status}
                        </span>
                        <p className="text-[10px] text-neutral-600 mt-1">Comm: ₦{fund.commission_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
