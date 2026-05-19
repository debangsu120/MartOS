'use client';

import { Header } from '@/components/Header';
import { Truck, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { suppliers } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

export default function SuppliersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f4]">
      <Header 
        title="Suppliers"
        subtitle="Manage your supplier relationships and purchase orders."
        showNav={false}
      />
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="font-display text-xl text-[#231a0f]">Suppliers Management</h2>
              <p className="text-[#45483c] mt-1">View and manage your supplier network.</p>
            </div>
            <button className="bg-[#3e5219] text-white text-xs px-6 py-2.5 rounded-xl hover:bg-[#556b2f] transition-colors shadow-[0_4px_14px_rgba(62,82,25,0.2)] flex items-center gap-2">
              <Plus size={16} /> Add Supplier
            </button>
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-all border border-[#c5c8b8]/10 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d7e5bb]/30 flex items-center justify-center text-[#3e5219]">
                    <Truck size={24} />
                  </div>
                  <span className="text-xs font-semibold text-[#3e5219] bg-[#d0eba1]/20 px-2 py-1 rounded-md">
                    {supplier.productsSupplied} products
                  </span>
                </div>
                <h3 className="font-display text-lg text-[#231a0f] mb-1">{supplier.name}</h3>
                <p className="text-sm text-[#45483c] mb-4">{supplier.contactPerson}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#45483c]">
                    <Mail size={14} /> {supplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#45483c]">
                    <Phone size={14} /> {supplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#45483c]">
                    <MapPin size={14} /> {supplier.address}
                  </div>
                </div>
                <div className="pt-4 border-t border-[#c5c8b8]/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-[#45483c]">Outstanding</p>
                    <p className="font-display text-lg text-[#231a0f]">{formatCurrency(supplier.balance)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#45483c]">Total Orders</p>
                    <p className="font-display text-lg text-[#3e5219]">{supplier.totalOrders}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}