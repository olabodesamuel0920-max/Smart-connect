import DashboardSidebar from "@/components/DashboardSidebar";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const pendingSellers = [
    { id: 1, name: "Gadget Hub Ltd", email: "hub@example.com", date: "2024-05-01" },
    { id: 2, name: "Phone Doctor", email: "doc@example.com", date: "2024-05-03" },
    { id: 3, name: "Smart Solutions", email: "smart@example.com", date: "2024-05-04" },
  ];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="admin" active="/admin" />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-neutral-400">Review and verify seller applications</p>
        </header>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Pending Verifications</h3>
            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
              {pendingSellers.length} New
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-900/50 text-neutral-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                  <th className="px-6 py-4 font-medium">Seller Details</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                  <th className="px-6 py-4 font-medium">Documents</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pendingSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{seller.name}</div>
                      <div className="text-sm text-neutral-500">{seller.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">
                      {seller.date}
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors">
                        <ExternalLink size={14} />
                        View ID
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject">
                          <XCircle size={20} />
                        </button>
                        <button className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Approve">
                          <CheckCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
