import { requireRole } from "@/lib/server-auth";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function BuyerProfilePage() {
  const profile = await requireRole(['customer']);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="customer" active="/dashboard/profile" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-8">My Profile</h1>
        <div className="glass-panel p-8 rounded-2xl">
          <p className="text-white">Email: {profile.email}</p>
          <p className="text-neutral-400">Role: {profile.role}</p>
        </div>
      </main>
    </div>
  );
}
