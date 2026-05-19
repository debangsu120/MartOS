'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard,
  PiggyBank,
  PieChart,
  ShoppingCart,
  TrendingUp,
  Minus,
  Calendar,
  MoreHorizontal,
  Package,
  AlertTriangle,
  TrendingDown
} from 'lucide-react';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [selectedPeriod]);

  async function loadReportsData() {
    setLoading(true);
    try {
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
      
      const [dashboard, trend] = await Promise.all([
        api.getDashboard(),
        api.getSalesTrend(days),
      ]);
      
      setDashboardData(dashboard);
      setSalesTrend(trend || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = dashboardData?.revenue?.total || 0;
  const totalTax = dashboardData?.revenue?.tax || 0;
  const totalDiscount = dashboardData?.revenue?.discount || 0;
  const profit = dashboardData?.profit?.amount || 0;
  const profitMargin = dashboardData?.profit?.margin || 0;
  const totalOrders = dashboardData?.orders?.total || 0;
  const avgOrderValue = dashboardData?.orders?.averageValue || 0;
  const totalProducts = dashboardData?.products?.total || 0;
  const lowStockCount = dashboardData?.products?.lowStock || 0;

  const netRevenue = totalRevenue - totalTax - totalDiscount;
  const grossProfit = netRevenue - (totalRevenue * 0.4);
  const netMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const chartData = salesTrend.length > 0 ? salesTrend : [
    { date: 'Mon', revenue: 0 },
    { date: 'Tue', revenue: 0 },
    { date: 'Wed', revenue: 0 },
    { date: 'Thu', revenue: 0 },
    { date: 'Fri', revenue: 0 },
    { date: 'Sat', revenue: 0 },
    { date: 'Sun', revenue: 0 }
  ];
  
  const maxRevenue = Math.max(...chartData.map(d => Number(d.revenue || 0)), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f4] flex items-center justify-center">
        <div className="text-[#3e5219]">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f4] flex flex-col">
      <Header 
        showNav={false}
        searchPlaceholder="Search reports..."
      />

      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-3xl text-[#231a0f] mb-2">Reports & Analytics</h2>
              <p className="text-base text-[#45483c]">Performance overview across all organic retail channels.</p>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-full p-1 soft-shadow">
              {[
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: 'quarter', label: 'This Quarter' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedPeriod(option.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                    selectedPeriod === option.id
                      ? "bg-[#f1e0cd] text-[#231a0f] shadow-sm"
                      : "text-[#45483c] hover:bg-[#fff1e4]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <div className="w-px h-6 bg-[#c5c8b8] mx-1"></div>
              <button className="px-3 py-2 rounded-full text-[#45483c] hover:bg-[#fff1e4] transition-colors flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-xs">Custom</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white to-[#fff1e4] rounded-xl p-6 soft-shadow hover-lift relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard size={64} className="text-[#3e5219]" />
              </div>
              <p className="text-xs font-medium text-[#45483c] uppercase tracking-wider mb-2">Total Revenue</p>
              <h3 className="font-display text-2xl text-[#231a0f] mb-4">{formatCurrency(totalRevenue)}</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[#556b2f] bg-[#d0eba1]/10 px-2 py-0.5 rounded-full text-xs">
                  <TrendingUp size={14} className="mr-1" /> {totalOrders} orders
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-[#fff1e4] rounded-xl p-6 soft-shadow hover-lift relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PiggyBank size={64} className="text-[#6b4323]" />
              </div>
              <p className="text-xs font-medium text-[#45483c] uppercase tracking-wider mb-2">Gross Profit</p>
              <h3 className="font-display text-2xl text-[#231a0f] mb-4">{formatCurrency(grossProfit)}</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[#556b2f] bg-[#d0eba1]/10 px-2 py-0.5 rounded-full text-xs">
                  <TrendingUp size={14} className="mr-1" /> {profitMargin.toFixed(1)}% margin
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-[#fff1e4] rounded-xl p-6 soft-shadow hover-lift relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieChart size={64} className="text-[#3e5219]" />
              </div>
              <p className="text-xs font-medium text-[#45483c] uppercase tracking-wider mb-2">Net Margin</p>
              <h3 className="font-display text-2xl text-[#231a0f] mb-4">{netMargin.toFixed(1)}%</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[#45483c] bg-[#f1e0cd] px-2 py-0.5 rounded-full text-xs">
                  <Minus size={14} className="mr-1" /> After taxes
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-[#fff1e4] rounded-xl p-6 soft-shadow hover-lift relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShoppingCart size={64} className="text-[#566342]" />
              </div>
              <p className="text-xs font-medium text-[#45483c] uppercase tracking-wider mb-2">Avg Order Value</p>
              <h3 className="font-display text-2xl text-[#231a0f] mb-4">{formatCurrency(avgOrderValue)}</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[#556b2f] bg-[#d0eba1]/10 px-2 py-0.5 rounded-full text-xs">
                  <TrendingUp size={14} className="mr-1" /> Per order
                </span>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 soft-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#d0eba1]/30 flex items-center justify-center text-[#3e5219]">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-[#45483c]">Total Products</p>
                <p className="font-display text-2xl text-[#231a0f]">{totalProducts}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 soft-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6]/30 flex items-center justify-center text-[#ba1a1a]">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-[#45483c]">Low Stock Items</p>
                <p className="font-display text-2xl text-[#ba1a1a]">{lowStockCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 soft-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f1e0cd]/30 flex items-center justify-center text-[#6b4323]">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm text-[#45483c]">Total Tax Collected</p>
                <p className="font-display text-2xl text-[#231a0f]">{formatCurrency(totalTax)}</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 soft-shadow flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl text-[#231a0f]">Revenue Trend</h3>
                  <p className="text-xs text-[#45483c]">Daily performance metrics</p>
                </div>
                <button className="p-2 hover:bg-[#f7e5d3] rounded-full transition-colors">
                  <MoreHorizontal size={20} className="text-[#45483c]" />
                </button>
              </div>

              <div className="flex-1 relative w-full rounded-lg overflow-hidden flex items-end justify-between px-2 pb-6 border-b border-l border-[#c5c8b8]/30">
                <div className="absolute left-[-24px] bottom-6 top-0 flex flex-col justify-between text-[10px] text-[#45483c] font-medium">
                  <span>{formatCurrency(maxRevenue)}</span>
                  <span>{formatCurrency(maxRevenue * 0.75)}</span>
                  <span>{formatCurrency(maxRevenue * 0.5)}</span>
                  <span>{formatCurrency(maxRevenue * 0.25)}</span>
                  <span>0</span>
                </div>

                <div className="absolute left-0 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-[#c5c8b8]/20"></div>
                  ))}
                </div>

                <div className="w-full flex justify-around items-end h-[200px] ml-12 z-10">
                  {chartData.map((d: any, index: number) => {
                    const height = (Number(d.revenue || 0) / maxRevenue) * 100;
                    const isHighest = d.revenue === Math.max(...chartData.map((x: any) => Number(x.revenue || 0)));
                    return (
                      <div 
                        key={d.date || index}
                        className={`w-8 md:w-12 rounded-t-md transition-colors relative group cursor-pointer ${
                          isHighest ? 'bg-[#3e5219]' : 'bg-[#d7e5bb]'
                        } ${!isHighest ? 'hover:bg-[#3e5219]/50' : ''}`}
                        style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#392f22] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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

              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#d7e5bb]"></div>
                  <span className="text-xs text-[#45483c]">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3e5219]"></div>
                  <span className="text-xs text-[#45483c]">Best Day</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 soft-shadow flex flex-col h-[400px]">
              <h3 className="font-display text-xl text-[#231a0f] mb-6">Financial Summary</h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                  <div className="p-4 bg-[#fff8f4] rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#45483c]">Gross Revenue</span>
                      <span className="font-semibold text-[#231a0f]">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="text-xs text-[#75796b]">Before any deductions</div>
                  </div>

                  <div className="p-4 bg-[#fff8f4] rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#45483c]">Discounts Given</span>
                      <span className="font-semibold text-[#ba1a1a]">-{formatCurrency(totalDiscount)}</span>
                    </div>
                    <div className="text-xs text-[#75796b]">Customer discounts</div>
                  </div>

                  <div className="p-4 bg-[#fff8f4] rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#45483c]">Tax Collected</span>
                      <span className="font-semibold text-[#6b4323]">{formatCurrency(totalTax)}</span>
                    </div>
                    <div className="text-xs text-[#75796b]">GST collected</div>
                  </div>

                  <div className="p-4 bg-[#d0eba1]/20 rounded-xl border border-[#3e5219]/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-[#3e5219]">Net Revenue</span>
                      <span className="font-display text-lg text-[#3e5219]">{formatCurrency(netRevenue)}</span>
                    </div>
                    <div className="text-xs text-[#3e5219]">After tax and discounts</div>
                  </div>

                  <div className="p-4 bg-[#fff8f4] rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#45483c]">Cost Estimate</span>
                      <span className="font-semibold text-[#45483c]">-{formatCurrency(totalRevenue * 0.4)}</span>
                    </div>
                    <div className="text-xs text-[#75796b]">~40% of revenue</div>
                  </div>

                  <div className="p-4 bg-[#3e5219]/10 rounded-xl border border-[#3e5219]/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-[#3e5219]">Est. Profit</span>
                      <span className="font-display text-lg text-[#3e5219]">{formatCurrency(grossProfit)}</span>
                    </div>
                    <div className="text-xs text-[#3e5219]">Revenue - Cost estimate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}