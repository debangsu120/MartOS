'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  ArrowLeftRight, 
  Upload, 
  Download, 
  PlusCircle,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  History,
  Package
} from 'lucide-react';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  quantity: number;
  rackLocation: string | null;
  shelfLocation: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    sellingPrice: number;
    costPrice: number;
    lowStockAlert: number;
    category?: { name: string };
  };
}

interface InventoryLog {
  id: string;
  type: string;
  quantity: number;
  reason: string | null;
  notes: string | null;
  createdAt: string;
  product: { name: string };
  user?: { name: string };
}

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  const filters = [
    { id: 'all', label: 'All Inventory' },
    { id: 'low', label: 'Low Stock' },
    { id: 'expiring', label: 'Expiring Soon' },
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const [inventoryData, lowStock] = await Promise.all([
        api.getInventory({}),
        api.getLowStock(),
      ]);
      setInventory(inventoryData || []);
      setLowStockItems(lowStock || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setLoading(false);
    }
  }

  async function loadLogs() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/inventory/logs?limit=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('martos_token')}`,
        },
      });
      const data = await response.json();
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }

  const handleAdjustment = async () => {
    if (!selectedItem || !adjustmentQty || !adjustmentReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.adjustStock(selectedItem.product.id, {
        type: adjustmentType,
        quantity: parseInt(adjustmentQty),
        reason: adjustmentReason,
        notes: adjustmentNotes,
      });
      toast.success(`Stock ${adjustmentType === 'add' ? 'added' : 'removed'} successfully`);
      setShowAdjustmentModal(false);
      resetAdjustmentForm();
      loadInventory();
    } catch (error: any) {
      toast.error(error.message || 'Failed to adjust stock');
    }
  };

  const resetAdjustmentForm = () => {
    setSelectedItem(null);
    setAdjustmentType('add');
    setAdjustmentQty('');
    setAdjustmentReason('');
    setAdjustmentNotes('');
  };

  const openAdjustmentModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustmentModal(true);
  };

  const openLogsModal = async () => {
    await loadLogs();
    setShowLogsModal(true);
  };

  const filteredInventory = inventory.filter((item: any) => {
    const matchesSearch = item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.product?.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'low' && item.quantity <= item.product.lowStockAlert);
    return matchesSearch && matchesFilter;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.product.sellingPrice), 0);
  const lowStockCount = inventory.filter(item => item.quantity <= item.product.lowStockAlert).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#3e5219]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f4]">
      <Header 
        title="Inventory Management"
        subtitle="Manage stock levels, locations, and product details."
      />
      
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display text-xl text-[#231a0f]">Inventory Management</h2>
              <p className="text-[#45483c] mt-1">Manage stock levels, locations, and product details.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={openLogsModal}
                className="bg-[#f7e5d3] text-[#231a0f] text-xs px-5 py-2.5 rounded-xl hover:bg-[#f1e0cd] transition-colors shadow-sm flex items-center gap-2">
                <History size={16} /> Stock History
              </button>
              <button className="bg-[#f7e5d3] text-[#231a0f] text-xs px-5 py-2.5 rounded-xl hover:bg-[#f1e0cd] transition-colors shadow-sm flex items-center gap-2">
                <Upload size={16} /> Bulk Import
              </button>
              <button className="bg-[#f7e5d3] text-[#231a0f] text-xs px-5 py-2.5 rounded-xl hover:bg-[#f1e0cd] transition-colors shadow-sm flex items-center gap-2">
                <Download size={16} /> Export List
              </button>
              <button 
                onClick={() => window.location.href = '/products/add'}
                className="bg-[#3e5219] text-white text-xs px-6 py-2.5 rounded-xl hover:bg-[#556b2f] transition-colors shadow-[0_4px_14px_rgba(62,82,25,0.2)] flex items-center gap-2">
                <PlusCircle size={16} /> Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-[#45483c] text-xs font-medium uppercase tracking-wide">Total Inventory Value</span>
                <div className="w-10 h-10 rounded-full bg-[#d0eba1]/20 flex items-center justify-center text-[#3e5219]">
                  <Package size={20} />
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#231a0f]">{formatCurrency(totalValue)}</div>
                <div className="flex items-center gap-1 text-[#3e5219] mt-1 text-sm font-medium">
                  <TrendingUp size={14} /> {inventory.length} products
                </div>
              </div>
            </div>

            <div className="bg-[#fff0ed] rounded-2xl p-6 shadow-soft-ambient border border-[#ba1a1a]/10 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-[#ba1a1a] text-xs font-medium uppercase tracking-wide">Low Stock Items</span>
                <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-[#ba1a1a]">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#ba1a1a]">{lowStockCount}</div>
                <div className="text-[#45483c] mt-1 text-sm">Require immediate reordering</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft-ambient border border-[#c5c8b8]/10 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-[#45483c] text-xs font-medium uppercase tracking-wide">Recent Stock Movement</span>
                <div className="w-10 h-10 rounded-full bg-[#d7e5bb]/30 flex items-center justify-center text-[#566342]">
                  <ArrowLeftRight size={20} />
                </div>
              </div>
              <div className="mt-4 flex gap-2 items-end h-full">
                {[40, 60, 50, 80, 65, 75, 90].map((h, i) => (
                  <div key={i} className="w-1/6 bg-[#d0eba1] rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft-ambient border border-[#c5c8b8]/10 overflow-hidden">
            <div className="p-6 border-b border-[#c5c8b8]/10 flex flex-col lg:flex-row gap-6 justify-between bg-[#fff8f4]">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b]" size={20} />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#fff1e4] border-transparent focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219] text-sm text-[#231a0f] placeholder:text-[#c5c8b8] transition-all"
                  placeholder="Search by product name, SKU..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                      selectedFilter === filter.id
                        ? "bg-[#3e5219] text-white shadow-sm"
                        : "bg-[#f7e5d3] text-[#231a0f] hover:bg-[#f1e0cd]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fff1e4] border-b border-[#c5c8b8]/20">
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Product</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">SKU</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Location</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c] w-48">Quantity</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c]">Price</th>
                    <th className="py-4 px-6 text-xs font-semibold text-[#45483c] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c8b8]/10 bg-white">
                  {filteredInventory.map((item: any) => {
                    const stockPercentage = Math.min((item.quantity / 500) * 100, 100);
                    const isLowStock = item.quantity <= item.product.lowStockAlert;
                    const location = [item.rackLocation, item.shelfLocation].filter(Boolean).join(' / ') || '-';
                    
                    return (
                      <tr key={item.id} className="hover:bg-[#fff8f4] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#f1e0cd] overflow-hidden shrink-0">
                              <div className="w-full h-full flex items-center justify-center bg-[#f7e5d3] text-[#45483c]">
                                <span className="text-xs">IMG</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-[#231a0f] text-sm">{item.product?.name || 'Unknown'}</div>
                              <div className="text-xs text-[#45483c] mt-0.5">{item.product?.category?.name || 'Uncategorized'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#45483c]">{item.product?.sku || '-'}</td>
                        <td className="py-4 px-6 text-sm text-[#45483c]">{location}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium w-8 ${isLowStock ? 'text-[#ba1a1a]' : 'text-[#231a0f]'}`}>{item.quantity}</span>
                            <div className="flex-1 h-1.5 bg-[#f1e0cd] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isLowStock ? 'bg-[#ba1a1a]' : 'bg-[#3e5219]'}`} 
                                style={{ width: `${stockPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            !isLowStock 
                              ? 'bg-[#3e5219]/10 text-[#3e5219]' 
                              : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                          }`}>
                            {isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-[#231a0f]">{formatCurrency(item.product?.sellingPrice || 0)}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => openAdjustmentModal(item)}
                            className="text-[#3e5219] hover:bg-[#d0eba1]/30 p-1.5 rounded-lg transition-colors"
                            title="Adjust Stock"
                          >
                            <ArrowLeftRight size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#c5c8b8]/10 flex items-center justify-between bg-[#fff8f4]">
              <span className="text-sm text-[#45483c]">Showing {filteredInventory.length} of {inventory.length} items</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg text-[#75796b] hover:bg-[#f1e0cd]">
                  <ChevronLeft size={18} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#3e5219] text-white text-sm font-medium flex items-center justify-center shadow-sm">1</button>
                <button className="p-1.5 rounded-lg text-[#45483c] hover:bg-[#f1e0cd]">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAdjustmentModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-[#c5c8b8]/20 flex items-center justify-between">
              <h3 className="font-display text-xl text-[#231a0f]">Adjust Stock</h3>
              <button 
                onClick={() => { setShowAdjustmentModal(false); resetAdjustmentForm(); }}
                className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors"
              >
                <X size={20} className="text-[#45483c]" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-[#fff8f4] rounded-xl">
                <p className="font-semibold text-[#231a0f]">{selectedItem.product?.name}</p>
                <p className="text-sm text-[#45483c]">SKU: {selectedItem.product?.sku}</p>
                <p className="text-sm text-[#45483c]">Current Stock: <span className="font-semibold text-[#231a0f]">{selectedItem.quantity}</span></p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#231a0f] mb-2">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAdjustmentType('add')}
                    className={`p-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                      adjustmentType === 'add' 
                        ? 'border-[#3e5219] bg-[#d0eba1]/20 text-[#3e5219]' 
                        : 'border-[#c5c8b8]/30 text-[#45483c] hover:border-[#3e5219]/30'
                    }`}
                  >
                    <Plus size={18} /> Add Stock
                  </button>
                  <button
                    onClick={() => setAdjustmentType('remove')}
                    className={`p-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                      adjustmentType === 'remove' 
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20 text-[#ba1a1a]' 
                        : 'border-[#c5c8b8]/30 text-[#45483c] hover:border-[#ba1a1a]/30'
                    }`}
                  >
                    <Minus size={18} /> Remove Stock
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#231a0f] mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#231a0f] mb-2">Reason *</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219]"
                >
                  <option value="">Select reason</option>
                  <option value="restock">Restock / New Delivery</option>
                  <option value="sale">Sale / Transaction</option>
                  <option value="return">Customer Return</option>
                  <option value="damage">Damaged / Expired</option>
                  <option value="correction">Stock Correction</option>
                  <option value="transfer">Transfer In/Out</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#231a0f] mb-2">Notes (Optional)</label>
                <textarea
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f1e0cd] border border-[#c5c8b8] rounded-xl text-[#231a0f] focus:outline-none focus:border-[#3e5219] resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-[#c5c8b8]/20 flex gap-3">
              <button 
                onClick={() => { setShowAdjustmentModal(false); resetAdjustmentForm(); }}
                className="flex-1 py-3 rounded-xl border border-[#c5c8b8] text-[#45483c] hover:bg-[#f1e0cd] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdjustment}
                className="flex-1 py-3 rounded-xl bg-[#3e5219] text-white hover:bg-[#556b2f] transition-colors"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#c5c8b8]/20 flex items-center justify-between">
              <h3 className="font-display text-xl text-[#231a0f]">Stock Adjustment History</h3>
              <button 
                onClick={() => setShowLogsModal(false)}
                className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors"
              >
                <X size={20} className="text-[#45483c]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-[#45483c]">
                  <History size={48} className="mx-auto mb-4 text-[#c5c8b8]" />
                  <p>No stock adjustments recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log: any) => (
                    <div key={log.id} className="p-4 bg-[#fff8f4] rounded-xl border border-[#c5c8b8]/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            log.type === 'add' ? 'bg-[#d0eba1] text-[#3e5219]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {log.type === 'add' ? <Plus size={16} /> : <Minus size={16} />}
                          </div>
                          <div>
                            <p className="font-semibold text-[#231a0f]">{log.product?.name || 'Product'}</p>
                            <p className="text-xs text-[#45483c]">{log.reason || 'No reason specified'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${log.type === 'add' ? 'text-[#3e5219]' : 'text-[#ba1a1a]'}`}>
                            {log.type === 'add' ? '+' : '-'}{log.quantity}
                          </p>
                          <p className="text-xs text-[#45483c]">
                            {new Date(log.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-[#45483c] mt-2 pl-11">{log.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#c5c8b8]/20">
              <button 
                onClick={() => setShowLogsModal(false)}
                className="w-full py-3 rounded-xl bg-[#3e5219] text-white hover:bg-[#556b2f] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-[#c5c8b8]/30 py-4 px-8 flex justify-between items-center">
        <div className="text-xs text-[#566342]">© 2024 MartOS Retail Systems. All rights reserved.</div>
        <div className="flex gap-6">
          <a className="text-xs text-[#45483c] hover:underline opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="text-xs text-[#45483c] hover:underline opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="text-xs text-[#45483c] hover:underline opacity-80 hover:opacity-100" href="#">Help Center</a>
          <a className="text-xs text-[#45483c] hover:underline opacity-80 hover:opacity-100" href="#">API Status</a>
        </div>
      </footer>
    </div>
  );
}