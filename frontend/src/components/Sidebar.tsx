'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ShoppingBag, 
  Truck, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Store
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isPOS?: boolean;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pos', icon: ShoppingCart, label: 'POS Terminal' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/products', icon: ShoppingBag, label: 'Products' },
  { href: '/suppliers', icon: Truck, label: 'Suppliers' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/users', icon: Users, label: 'User Management' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ className, isPOS }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={cn(
      "h-screen w-64 fixed left-0 top-0 bg-[#fff1e4] shadow-sm flex flex-col border-r border-[#c5c8b8]/20 z-50",
      isPOS && "w-64",
      className
    )}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#556b2f] flex items-center justify-center text-white">
          <Store size={24} />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-[#3e5219]">MartOS</h1>
          <p className="text-xs text-[#45483c] font-medium">Premium Retail</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 mb-6">
        <Link 
          href="/pos"
          className="w-full bg-[#3e5219] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#556b2f] transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          New Sale
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium",
                isActive
                  ? "bg-[#d7e5bb] text-[#5a6745] font-semibold shadow-[0_4px_12px_rgba(85,107,47,0.15)]"
                  : "text-[#45483c] hover:bg-[#f1e0cd] hover:text-[#231a0f]"
              )}
            >
              <item.icon size={20} className={isActive ? "fill-current" : ""} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-[#c5c8b8]/20 space-y-1">
        <Link 
          href="/support"
          className="flex items-center gap-3 px-4 py-2 text-[#45483c] hover:bg-[#f1e0cd] rounded-lg transition-colors text-sm"
        >
          <HelpCircle size={18} />
          <span>Support</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-[#45483c] hover:bg-[#f1e0cd] rounded-lg transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}