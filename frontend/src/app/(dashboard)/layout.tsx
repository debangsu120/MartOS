'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Sidebar } from '@/components/Sidebar';

const publicPaths = ['/login', '/forgot-password'];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/login');
    } else if (isAuthenticated && user) {
      const userRole = user.role || 'cashier';
      if (userRole === 'cashier' && !pathname.startsWith('/pos')) {
        router.push('/pos');
      }
    }
  }, [isAuthenticated, user, router, pathname]);

  const isCashierRestricted = isAuthenticated && user && user.role === 'cashier' && !pathname.startsWith('/pos');

  if (!isAuthenticated || isCashierRestricted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}