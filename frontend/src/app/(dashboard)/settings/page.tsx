'use client';

import { Header } from '@/components/Header';
import { Store, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f4]">
      <Header 
        title="Settings"
        subtitle="Configure your store and system preferences."
        showNav={false}
      />
      <main className="flex-1 p-8">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <div className="mb-4">
            <h2 className="font-display text-xl text-[#231a0f]">Settings</h2>
            <p className="text-[#45483c] mt-1">Configure your store and system preferences.</p>
          </div>

          {/* Store Information */}
          <section className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#c5c8b8]/10">
            <h3 className="text-base text-[#231a0f] font-semibold mb-6 flex items-center gap-2 border-b border-[#c5c8b8]/30 pb-4">
              <Store size={20} className="text-[#3e5219]" /> Store Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="input-float">
                <input id="storeName" placeholder=" " type="text" defaultValue="Boutique Mart" />
                <label htmlFor="storeName">Store Name</label>
              </div>
              <div className="input-float">
                <input id="storePhone" placeholder=" " type="text" defaultValue="+91 9876543210" />
                <label htmlFor="storePhone">Phone Number</label>
              </div>
              <div className="input-float md:col-span-2">
                <input id="storeAddress" placeholder=" " type="text" defaultValue="123 Market Road, Chennai" />
                <label htmlFor="storeAddress">Address</label>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#c5c8b8]/10">
            <h3 className="text-base text-[#231a0f] font-semibold mb-6 flex items-center gap-2 border-b border-[#c5c8b8]/30 pb-4">
              <Bell size={20} className="text-[#3e5219]" /> Notifications
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Low Stock Alerts', desc: 'Get notified when products fall below threshold' },
                { label: 'Daily Sales Summary', desc: 'Receive end-of-day sales report' },
                { label: 'Order Updates', desc: 'Notifications for purchase order status changes' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-[#fff1e4] rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-[#231a0f]">{item.label}</p>
                    <p className="text-xs text-[#45483c]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" defaultChecked />
                    <div className="w-11 h-6 bg-[#c5c8b8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3e5219]"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-[#3e5219] hover:bg-[#556b2f] transition-colors shadow-sm flex items-center gap-2">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}