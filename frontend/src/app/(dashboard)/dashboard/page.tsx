'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle, 
  BarChart3,
  ArrowRight,
  ShoppingBag,
  Package,
  PlusCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface DashboardData {
  revenue: { total: number; tax: number; discount: number };
  profit: { amount: number; margin: number };
  orders: { total: number; averageValue: number };
  products: { total: number; lowStock: number };
}

interface SalesTrend {
  date: string;
  revenue: number;
}

interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
  sold?: number;
}

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  lowStockAlert: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboard, trend, products, stock] = await Promise.all([
          api.getDashboard(),
          api.getSalesTrend(7),
          api.getTopProducts(5),
          api.getLowStock()
        ]);
        setData(dashboard);
        setSalesTrend(trend);
        setTopProducts(products);
        setLowStock(stock);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f4] flex items-center justify-center">
        <div className="text-[#3e5219]">Loading...</div>
      </div>
    );
  }

  const chartData = salesTrend.length > 0 ? salesTrend : [
    { date: 'Mon', revenue: 0 },
    { date: 'Tue', revenue: 0 },
    { date: 'Wed', revenue: 0 },
    { date: 'Thu', revenue: 0 },
    { date: 'Fri', revenue: 0 },
    { date: 'Sat', revenue: 0 },
    { date: 'Sun', revenue: 0 }
  ];
  
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  return (
    <div className="min-h-screen bg-[#fff8f4]">
      <Header 
        title="Good morning, Store Manager"
        subtitle="Here's what's happening at your store today."
      />

      <main className="p-6 max-w-[1440px] mx-auto">
        {/* Category Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-6 py-2 rounded-full bg-[#3e5219] text-white font-medium text-xs whitespace-nowrap shadow-soft-ambient hover:bg-[#50652a] transition-colors">
            Overview
          </button>
          <button className="px-6 py-2 rounded-full bg-[#fff1e4] text-[#45483c] font-medium text-xs whitespace-nowrap hover:bg-[#f1e0cd] transition-colors">
            Live Feed
          </button>
          <button className="px-6 py-2 rounded-full bg-[#fff1e4] text-[#45483c] font-medium text-xs whitespace-nowrap hover:bg-[#f1e0cd] transition-colors">
            Store Analytics
          </button>
          <button className="px-6 py-2 rounded-full bg-[#fff1e4] text-[#45483c] font-medium text-xs whitespace-nowrap hover:bg-[#f1e0cd] transition-colors">
            Inventory Status
          </button>
        </div>

        {/* KPI Cards - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Today's Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#c5c8b8]/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#fdebd8] rounded-xl text-[#865a38]">
                <ShoppingCart size={24} />
              </div>
              <span className="flex items-center text-[#3e5219] text-sm font-semibold bg-[#d0eba1]/20 px-2 py-1 rounded-md">
                <TrendingUp size={14} className="mr-1" /> +12.5%
              </span>
            </div>
            <p className="text-[#45483c] text-sm mb-1">Today's Sales</p>
            <h3 className="font-display text-2xl text-[#231a0f]">{formatCurrency(data?.revenue.total || 0)}</h3>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#c5c8b8]/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#f1e0cd] rounded-xl text-[#6b4323]">
                <ShoppingBag size={24} />
              </div>
              <span className="flex items-center text-[#3e5219] text-sm font-semibold bg-[#d0eba1]/20 px-2 py-1 rounded-md">
                <TrendingUp size={14} className="mr-1" /> +8.2%
              </span>
            </div>
            <p className="text-[#45483c] text-sm mb-1">Orders</p>
            <h3 className="font-display text-2xl text-[#231a0f]">{data?.orders.total || 0}</h3>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#ffdad6]/50 bg-gradient-to-br from-white to-[#fffaf9]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#ffdad6] rounded-xl text-[#ba1a1a]">
                <AlertTriangle size={24} />
              </div>
              <button className="text-[#ba1a1a] text-sm font-semibold hover:underline">View All</button>
            </div>
            <p className="text-[#45483c] text-sm mb-1">Low Stock Items</p>
            <h3 className="font-display text-2xl text-[#231a0f]">{data?.products.lowStock || 0}</h3>
          </div>

          {/* Profit Margin */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow border border-[#c5c8b8]/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#d7e5bb] rounded-xl text-[#566342]">
                <BarChart3 size={24} />
              </div>
              <span className="flex items-center text-[#75796b] text-sm font-semibold bg-[#f1e0cd] px-2 py-1 rounded-md">
                <span className="text-lg mr-1">→</span> {data?.profit.margin.toFixed(1) || 0}%
              </span>
            </div>
            <p className="text-[#45483c] text-sm mb-1">Avg Margin</p>
            <h3 className="font-display text-2xl text-[#231a0f]">{data?.profit.margin.toFixed(1) || 0}%</h3>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Revenue Trends Chart */}
          <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-xl text-[#231a0f]">Revenue Trends</h3>
                <p className="text-sm text-[#45483c]">Last 7 Days vs Previous</p>
              </div>
              <select className="bg-[#fff1e4] border-none rounded-lg text-sm text-[#45483c] py-2 pl-3 pr-8 cursor-pointer">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 relative min-h-[250px] w-full flex items-end justify-between gap-2 pt-10 pb-4 px-2">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-[#75796b] text-right pr-2">
                <span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0</span>
              </div>
              
              {/* Horizontal grid lines */}
              <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-[#c5c8b8]/20 h-0"></div>
                ))}
              </div>
              
              {/* Bars */}
              <div className="w-full flex justify-around items-end h-[200px] ml-12 z-10">
                {chartData.map((d: any, index: number) => {
                  const height = (Number(d.revenue || 0) / maxRevenue) * 100;
                  const isHighest = d.revenue === Math.max(...chartData.map((x: any) => x.revenue || 0));
                  return (
                    <div 
                      key={d.date || index}
                      className={`w-8 md:w-12 rounded-t-md transition-colors relative group cursor-pointer ${
                        isHighest ? 'bg-[#3e5219]' : 'bg-[#f1e0cd]'
                      } ${!isHighest ? 'hover:bg-[#d7e5bb]' : ''}`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#392f22] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatCurrency(Number(d.revenue || 0))}
                      </div>
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs ${
                        isHighest ? 'text-[#3e5219] font-semibold' : 'text-[#75796b]'
                      }`}>
                        {d.date ? d.date.slice(0, 3) : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 bg-[#f1e0cd] rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10 flex flex-col gap-4">
            <h3 className="font-display text-lg text-[#231a0f] mb-2">Quick Actions</h3>
            
            <Link href="/pos" className="w-full bg-[#3e5219] text-white rounded-xl py-4 px-4 flex items-center gap-3 hover:bg-[#50652a] transition-all hover:scale-[1.02] shadow-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingCart size={20} className="fill-current" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-semibold">New POS Sale</div>
                <div className="text-xs text-white/80">Open terminal</div>
              </div>
              <ArrowRight size={18} />
            </Link>
            
            <Link href="/inventory" className="w-full bg-white text-[#231a0f] rounded-xl py-4 px-4 flex items-center gap-3 hover:bg-[#fff1e4] transition-all hover:scale-[1.02] border border-[#c5c8b8]/20 shadow-sm">
              <div className="bg-[#f1e0cd] p-2 rounded-lg text-[#3e5219]">
                <Package size={20} />
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-semibold">Receive Stock</div>
                <div className="text-xs text-[#45483c]">Update inventory</div>
              </div>
            </Link>
            
            <Link href="/products/add" className="w-full bg-white text-[#231a0f] rounded-xl py-4 px-4 flex items-center gap-3 hover:bg-[#fff1e4] transition-all hover:scale-[1.02] border border-[#c5c8b8]/20 shadow-sm">
              <div className="bg-[#f1e0cd] p-2 rounded-lg text-[#6b4323]">
                <PlusCircle size={20} />
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-semibold">Add Product</div>
                <div className="text-xs text-[#45483c]">Create new SKU</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg text-[#231a0f]">Top Performers</h3>
              <button className="text-sm text-[#3e5219] font-semibold hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#fff1e4] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#f1e0cd] overflow-hidden border border-[#c5c8b8]/20 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-[#d7e5bb] to-[#f1e0cd] flex items-center justify-center text-[#566342] font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#231a0f] mb-0.5">{product.name}</h4>
                      <p className="text-xs text-[#45483c]">In Stock: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#231a0f]">{formatCurrency(product.revenue)}</div>
                    <div className="text-xs text-[#3e5219] bg-[#d0eba1]/20 px-2 py-0.5 rounded inline-block mt-1">{product.quantity} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg text-[#231a0f]">Inventory Alerts</h3>
              <span className="bg-[#ffdad6] text-[#ba1a1a] text-xs px-2 py-1 rounded-full font-semibold">Action Required</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c5c8b8]/20">
                    <th className="pb-3 text-xs font-semibold text-[#45483c]">Product</th>
                    <th className="pb-3 text-xs font-semibold text-[#45483c]">Stock</th>
                    <th className="pb-3 text-xs font-semibold text-[#45483c]">Status</th>
                    <th className="pb-3 text-xs font-semibold text-[#45483c] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {lowStock.map((item) => (
                    <tr key={item.id} className="border-b border-[#c5c8b8]/10 hover:bg-[#fff1e4] transition-colors">
                      <td className="py-4 text-[#231a0f] font-medium">{item.name}</td>
                      <td className={`py-4 font-semibold ${item.quantity <= item.lowStockAlert ? 'text-[#ba1a1a]' : 'text-[#6b4323]'}`}>
                        {item.quantity} units
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${
                          item.quantity <= item.lowStockAlert * 0.5 
                            ? 'bg-[#ffdad6]/50 text-[#ba1a1a]' 
                            : 'bg-[#f1e0cd] text-[#45483c]'
                        }`}>
                          {item.quantity <= item.lowStockAlert * 0.5 ? 'critical' : 'low'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-[#3e5219] hover:text-[#50652a] font-semibold text-sm">Reorder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-[#c5c8b8]/30 flex justify-between items-center">
        <p className="text-xs text-[#566342] opacity-80">© 2024 MartOS Retail Systems. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="text-xs text-[#566342] opacity-80 hover:opacity-100 hover:underline" href="#">Terms of Service</a>
          <a className="text-xs text-[#566342] opacity-80 hover:opacity-100 hover:underline" href="#">Privacy Policy</a>
          <a className="text-xs text-[#566342] opacity-80 hover:opacity-100 hover:underline" href="#">Help Center</a>
          <a className="text-xs text-[#566342] opacity-80 hover:opacity-100 hover:underline" href="#">API Status</a>
        </div>
      </footer>
    </div>
  );
}