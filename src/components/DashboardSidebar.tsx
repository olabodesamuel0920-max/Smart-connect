import Link from "next/link";
import { LayoutDashboard, ShoppingBag, User, Store, ShieldCheck, Settings, LogOut } from "lucide-react";

interface SidebarProps {
  role: 'customer' | 'seller' | 'admin';
  active?: string;
}

export default function DashboardSidebar({ role, active }: SidebarProps) {
  const customerLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const sellerLinks = [
    { name: 'Store Overview', href: '/seller', icon: LayoutDashboard },
    { name: 'Products', href: '/seller/products', icon: ShoppingBag },
    { name: 'Store Profile', href: '/seller/store', icon: Store },
  ];

  const adminLinks = [
    { name: 'Pending Sellers', href: '/admin', icon: ShieldCheck },
    { name: 'All Profiles', href: '/admin/profiles', icon: User },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'seller' ? sellerLinks : customerLinks;

  return (
    <aside className="w-64 glass-panel border-y-0 border-l-0 hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">SC</span>
          </div>
          Smart Connect
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active === link.href 
                  ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
