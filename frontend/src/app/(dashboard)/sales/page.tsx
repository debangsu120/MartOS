'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Eye,
  ChevronDown,
  Receipt,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  Wallet,
  X,
  Printer
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
}

interface Sale {
  id: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  user?: { name: string };
  items?: SaleItem[];
  customer?: { name: string };
}

const paymentIcons: Record<string, any> = {
  cash: Banknote,
  card: CreditCard,
  upi: QrCode,
  wallet: Wallet,
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadSales();
  }, [selectedPeriod, selectedStatus]);

  async function loadSales() {
    setLoading(true);
    try {
      const params: any = {};
      
      if (selectedPeriod === 'today') {
        params.startDate = new Date().toISOString().split('T')[0];
      } else if (selectedPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        params.startDate = weekAgo.toISOString().split('T')[0];
      } else if (selectedPeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.startDate = monthAgo.toISOString().split('T')[0];
      }

      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const data = await api.getSales(params);
      setSales(data || []);
    } catch (error) {
      console.error('Failed to load sales:', error);
      toast.error('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = sales.filter(sale => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sale.orderNumber?.toLowerCase().includes(query) ||
        sale.customer?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const printReceipt = (sale: Sale) => {
    const printContent = `
      <div style="padding: 20px; font-family: monospace;">
        <h2 style="text-align: center;">MartOS - Sales Receipt</h2>
        <p><strong>Order:</strong> ${sale.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>
        <hr/>
        <p><strong>Items:</strong></p>
        ${sale.items?.map(item => `
          <p>${item.productName} x${item.quantity} = ${formatCurrency(Number(item.totalAmount))}</p>
        `).join('')}
        <hr/>
        <p><strong>Subtotal:</strong> ${formatCurrency(Number(sale.subtotal))}</p>
        <p><strong>Tax:</strong> ${formatCurrency(Number(sale.taxAmount))}</p>
        <p><strong>Total:</strong> ${formatCurrency(Number(sale.totalAmount))}</p>
        <p><strong>Payment:</strong> ${sale.paymentMethod?.toUpperCase()}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToCSV = () => {
    const headers = ['Order #', 'Date', 'Customer', 'Items', 'Subtotal', 'Tax', 'Discount', 'Total', 'Payment', 'Status'];
    const rows = filteredSales.map(sale => [
      sale.orderNumber,
      new Date(sale.createdAt).toLocaleString(),
      sale.customer?.name || 'Walk-in',
      sale.items?.length || 0,
      sale.subtotal,
      sale.taxAmount,
      sale.discountAmount,
      sale.totalAmount,
      sale.paymentMethod,
      sale.status,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sales exported successfully');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f4]">
      <Header 
        title="Sales History"
        subtitle="View and manage all sales transactions"
        showNav={false}
      />
      
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display text-xl text-[#231a0f]">Transaction History</h2>
              <p className="text-[#45483c] mt-1">View all sales transactions and receipts</p>
            </div>
            <button 
              onClick={exportToCSV}
              className="bg-[#3e5219] text-white text-xs px-6 py-2.5 rounded-xl hover:bg-[#556b2f] transition-colors shadow-sm flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d0eba1]/30 flex items-center justify-center text-[#3e5219]">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#45483c]">Total Revenue</p>
                  <p className="font-display text-2xl text-[#231a0f]">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f1e0cd]/30 flex items-center justify-center text-[#6b4323]">
                  <Receipt size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#45483c]">Total Orders</p>
                  <p className="font-display text-2xl text-[#231a0f]">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d7e5bb]/30 flex items-center justify-center text-[#566342]">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#45483c]">Avg Order Value</p>
                  <p className="font-display text-2xl text-[#231a0f]">{formatCurrency(avgOrderValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft-ambient border border-[#c5c8b8]/10 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b]" size={20} />
                <input
                  type="text"
                  placeholder="Search by order number or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#fff1e4] border-transparent focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219] text-sm text-[#231a0f] placeholder:text-[#c5c8b8] transition-all rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219] text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219] text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="void">Void/Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-2xl shadow-soft-ambient border border-[#c5c8b8]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fff1e4] border-b border-[#c5c8b8]/20">
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Order #</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Date & Time</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Customer</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Items</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Payment</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Total</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c8b8]/10">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#45483c]">Loading...</td>
                    </tr>
                  ) : filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#45483c]">No sales found</td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => {
                      const PaymentIcon = paymentIcons[sale.paymentMethod] || CreditCard;
                      return (
                        <tr key={sale.id} className="hover:bg-[#fff8f4] transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm text-[#3e5219] font-semibold">{sale.orderNumber}</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#45483c]">
                            {formatDate(sale.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#231a0f]">
                            {sale.customer?.name || 'Walk-in Customer'}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#45483c]">
                            {sale.items?.length || 0} items
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-[#45483c]">
                              <PaymentIcon size={16} /> {sale.paymentMethod?.toUpperCase()}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-[#231a0f]">
                            {formatCurrency(Number(sale.totalAmount))}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              sale.status === 'completed' 
                                ? 'bg-[#3e5219]/10 text-[#3e5219]' 
                                : sale.status === 'void'
                                ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                                : 'bg-[#f1e0cd] text-[#45483c]'
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => viewSaleDetails(sale)}
                                className="p-1.5 hover:bg-[#f1e0cd] rounded-lg transition-colors text-[#3e5219]"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => printReceipt(sale)}
                                className="p-1.5 hover:bg-[#f1e0cd] rounded-lg transition-colors text-[#45483c]"
                                title="Print Receipt"
                              >
                                <Printer size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Sale Detail Modal */}
      {showDetailModal && selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#c5c8b8]/20 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-[#231a0f]">Sale Details</h3>
                <p className="text-sm text-[#45483c]">{selectedSale.orderNumber}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors"
              >
                <X size={20} className="text-[#45483c]" />
              </button>
            </div>

            <div className="p-6" id="receipt-content">
              <div className="text-center mb-6 pb-4 border-b border-dashed border-[#c5c8b8]/40">
                <h2 className="font-display text-2xl text-[#3e5219] mb-1">MartOS</h2>
                <p className="text-xs text-[#45483c]">Sales Receipt</p>
                <p className="text-xs text-[#45483c] mt-2">
                  {new Date(selectedSale.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#45483c]">Order Number</span>
                  <span className="text-[#231a0f] font-mono">{selectedSale.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#45483c]">Customer</span>
                  <span className="text-[#231a0f]">{selectedSale.customer?.name || 'Walk-in'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#45483c]">Payment Method</span>
                  <span className="text-[#231a0f] uppercase">{selectedSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#45483c]">Status</span>
                  <span className={`${
                    selectedSale.status === 'completed' ? 'text-[#3e5219]' : 'text-[#ba1a1a]'
                  } font-semibold`}>{selectedSale.status}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-[#c5c8b8]/40 py-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-[#75796b]">
                      <th className="text-left font-medium">Item</th>
                      <th className="text-center font-medium">Qty</th>
                      <th className="text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#231a0f]">
                    {selectedSale.items?.map((item) => (
                      <tr key={item.id} className="border-b border-[#c5c8b8]/10 last:border-0">
                        <td className="py-2">{item.productName}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(Number(item.totalAmount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#45483c]">Subtotal</span>
                  <span className="text-[#231a0f]">{formatCurrency(Number(selectedSale.subtotal))}</span>
                </div>
                {Number(selectedSale.discountAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#45483c]">Discount</span>
                    <span className="text-[#3e5219]">-{formatCurrency(Number(selectedSale.discountAmount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#45483c]">Tax</span>
                  <span className="text-[#231a0f]">{formatCurrency(Number(selectedSale.taxAmount))}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#c5c8b8]/40">
                  <span className="font-semibold text-[#231a0f]">Total</span>
                  <span className="font-display text-lg text-[#3e5219]">{formatCurrency(Number(selectedSale.totalAmount))}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#c5c8b8]/20 flex gap-3">
              <button 
                onClick={() => printReceipt(selectedSale)}
                className="flex-1 py-3 rounded-xl bg-[#f1e0cd] text-[#231a0f] hover:bg-[#f7e5d3] transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#3e5219] text-white hover:bg-[#556b2f] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}