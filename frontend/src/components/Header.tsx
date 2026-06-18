'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, Settings, HelpCircle, AlertTriangle, X, Package } from 'lucide-react';
import { currentUser } from '@/lib/data';
import { useAuthStore } from '@/store';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNav?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  lowStockAlert: number;
  inventory?: { quantity: number }[];
}

const navLinks = [
  { href: '/dashboard', label: 'Overview', roles: ['owner', 'manager'] },
  { href: '/dashboard/live-feed', label: 'Live Feed', roles: ['owner', 'manager'] },
  { href: '/dashboard/analytics', label: 'Store Analytics', roles: ['owner', 'manager'] },
];

export function Header({ 
  title, 
  subtitle, 
  showNav = true, 
  showSearch = true, 
  searchPlaceholder = "Search products, orders...",
  actions 
}: HeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || 'cashier';

  const filteredNavLinks = navLinks.filter(link => !link.roles || link.roles.includes(userRole));

  const displayName = user?.name || currentUser.name;
  const displayAvatar = user?.avatar || currentUser.avatar;

  useEffect(() => {
    if (showNotifications) {
      loadLowStockAlerts();
    }
  }, [showNotifications]);

  async function loadLowStockAlerts() {
    setLoadingAlerts(true);
    try {
      const items = await api.getLowStock();
      setLowStockItems(items || []);
    } catch (error) {
      console.error('Failed to load low stock alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  }

  const lowStockCount = lowStockItems.length;

  return (
    <header className="h-20 flex items-center justify-between px-6 border-b border-[#c5c8b8]/10 bg-[#fff8f4] sticky top-0 z-40">
      <div className="flex items-center gap-8 flex-1">
        {showNav && filteredNavLinks.length > 0 && (
          <nav className="hidden md:flex gap-6">
            {filteredNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm pb-1 font-medium transition-all ${
                    isActive
                      ? "text-[#3e5219] border-b-2 border-[#3e5219]"
                      : "text-[#45483c] hover:text-[#3e5219]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75796b]" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-64 pl-10 pr-4 py-2 bg-[#fff1e4] border-none rounded-full text-sm focus:ring-2 focus:ring-[#3e5219] focus:bg-white transition-colors placeholder:text-[#c5c8b8]"
            />
          </div>
        )}

        {actions}

        <div className="flex items-center gap-2 text-[#45483c]">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors relative"
            >
              <Bell size={20} />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {lowStockCount > 9 ? '9+' : lowStockCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#c5c8b8]/20 overflow-hidden z-50">
                <div className="p-4 border-b border-[#c5c8b8]/20 flex items-center justify-between bg-[#fff8f4]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-[#ba1a1a]" />
                    <span className="font-semibold text-[#231a0f]">Low Stock Alerts</span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-[#f1e0cd] rounded-full transition-colors"
                  >
                    <X size={16} className="text-[#45483c]" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {loadingAlerts ? (
                    <div className="p-4 text-center text-[#45483c]">Loading...</div>
                  ) : lowStockItems.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#d0eba1]/30 flex items-center justify-center mx-auto mb-3">
                        <Package size={24} className="text-[#3e5219]" />
                      </div>
                      <p className="text-sm text-[#45483c]">All products are well stocked!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#c5c8b8]/10">
                      {lowStockItems.slice(0, 5).map((item) => {
                        const qty = item.inventory?.[0]?.quantity || 0;
                        return (
                          <div key={item.id} className="p-4 hover:bg-[#fff8f4] transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#ffdad6]/30 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={16} className="text-[#ba1a1a]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#231a0f] text-sm truncate">{item.name}</p>
                                <p className="text-xs text-[#45483c]">SKU: {item.sku}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-semibold text-[#ba1a1a]">
                                    Only {qty} left
                                  </span>
                                  <span className="text-xs text-[#75796b]">
                                    (Alert at {item.lowStockAlert})
                                  </span>
                                </div>
                              </div>
                              <a 
                                href="/inventory"
                                className="text-xs text-[#3e5219] hover:underline flex-shrink-0"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {lowStockItems.length > 5 && (
                  <div className="p-3 border-t border-[#c5c8b8]/20 bg-[#fff8f4] text-center">
                    <a 
                      href="/inventory?filter=low"
                      className="text-sm text-[#3e5219] hover:underline font-medium"
                    >
                      View all {lowStockItems.length} alerts
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-[#c5c8b8]/30">
          <div className="w-8 h-8 rounded-full bg-[#f1e0cd] overflow-hidden border border-[#c5c8b8]/30">
            {displayAvatar ? (
              <img 
                src={displayAvatar} 
                alt={displayName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#556b2f] text-white text-xs font-medium">
                {displayName.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden lg:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-[#231a0f]">
              {displayName}
            </span>
            <span className="text-[10px] text-[#75796b] font-semibold capitalize tracking-wide">
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}