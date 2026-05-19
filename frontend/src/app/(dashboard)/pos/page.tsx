'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Delete, 
  CreditCard, 
  QrCode, 
  Wallet,
  Banknote,
  ArrowRight,
  X,
  Check,
  Printer
} from 'lucide-react';
import { api } from '@/lib/api';
import { usePOSStore } from '@/store';
import { formatCurrency, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: string;
  category?: { name: string };
  inventory?: { quantity: number }[];
}

interface ReceiptData {
  orderNumber: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; total: number }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  date: string;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card' | 'upi' | 'wallet'>('upi');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData.items || productsData);
        setCategories([{ name: 'All Products' }, ...categoriesData]);
      } catch (error) {
        console.error('Failed to load POS data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  
  const { 
    cart, 
    currentOrderNumber, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getDiscount,
    getTax,
    getTotal
  } = usePOSStore();

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paymentMethods = [
    { id: 'cash', icon: Banknote, label: 'Cash' },
    { id: 'card', icon: CreditCard, label: 'Card' },
    { id: 'upi', icon: QrCode, label: 'UPI' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
  ] as const;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          discountPercent: item.discount || 0,
        })),
        paymentMethod: selectedPayment,
      };

      const result = await api.createSale(saleData);
      
      const receipt: ReceiptData = {
        orderNumber: result.orderNumber || `ORD-${Date.now()}`,
        items: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice,
          total: item.product.sellingPrice * item.quantity,
        })),
        subtotal: getSubtotal(),
        discount: getDiscount(),
        tax: getTax(),
        total: getTotal(),
        paymentMethod: selectedPayment,
        date: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      
      setReceiptData(receipt);
      setShowReceipt(true);
      clearCart();
      toast.success('Sale completed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to process sale');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        showNav={false}
        showSearch={false}
        actions={
          <div className="flex items-center gap-3">
            <button className="bg-[#f1e0cd] text-[#3e5219] text-xs px-4 py-2 rounded-full hover:bg-[#f7e5d3] transition-colors flex items-center gap-2">
              <span className="text-sm">↻</span> Sync Data
            </button>
            <button className="bg-[#3e5219] text-white text-xs px-4 py-2 rounded-full hover:bg-[#556b2f] transition-colors flex items-center gap-2">
              <Plus size={14} /> Quick Add
            </button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <section className="flex-1 flex flex-col bg-[#fff8f4] p-6">
          <div className="mb-8 space-y-6">
            <div className="relative w-full max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                qr_code_scanner
              </span>
              <input
                className="w-full bg-white border-0 rounded-[16px] pl-12 pr-4 py-4 text-lg text-[#231a0f] shadow-soft-ambient focus:ring-2 focus:ring-[#3e5219] focus:outline-none transition-all placeholder:text-[#c5c8b8]"
                placeholder="Scan barcode or search products..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f1e0cd] p-2 rounded-xl text-[#3e5219] hover:bg-[#f7e5d3] transition-colors">
                <Search size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((category: any) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-full font-medium text-xs transition-all",
                    selectedCategory === category.name
                      ? "bg-[#3e5219] text-white shadow-sm"
                      : "bg-[#d7e5bb]/40 text-[#5a6745] hover:bg-[#d7e5bb]/60"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[24px] overflow-hidden shadow-soft-ambient hover:shadow-hover-lift transition-all flex flex-col group cursor-pointer border border-transparent hover:border-[#3e5219]/10"
                >
                  <div className="h-48 bg-[#f1e0cd] relative p-4 flex items-center justify-center">
                    {product.category?.name?.includes('Snacks') && (
                      <div className="absolute top-4 left-4 bg-[#3e5219] text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-xs">★</span> Bestseller
                      </div>
                    )}
                    <img
                      alt={product.name}
                      src="https://placehold.co/200x200/f1e0cd/556b2f?text=Product"
                      className="object-contain h-full w-full mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-[18px] text-[#231a0f] leading-snug mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[#75796b] text-xs font-medium mb-4">200 Gms</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display text-[20px] text-[#3e5219]">{formatCurrency(Number(product.sellingPrice))}</span>
                      <button
                        onClick={() => addToCart(product as any)}
                        className="w-10 h-10 rounded-full bg-[#f1e0cd] text-[#3e5219] flex items-center justify-center hover:bg-[#3e5219] hover:text-white transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="w-[420px] bg-white border-l border-[#c5c8b8]/20 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div className="p-6 border-b border-[#c5c8b8]/10 flex items-center justify-between bg-[#fff8f4]/50 backdrop-blur-sm">
            <div>
              <h2 className="font-display text-xl text-[#231a0f]">Current Order</h2>
              <p className="text-xs text-[#75796b] mt-1">Order #{currentOrderNumber} • {cart.length} Items</p>
            </div>
            <button 
              onClick={clearCart}
              className="text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#ba1a1a] p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <Delete size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart size={48} className="text-[#c5c8b8] mb-4" />
                <p className="text-[#45483c]">No items in cart</p>
                <p className="text-sm text-[#75796b]">Add products to start a sale</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-[#fff8f4] rounded-xl p-3 shadow-sm border border-[#c5c8b8]/10">
                  <div className="w-16 h-16 bg-[#f1e0cd] rounded-lg p-1">
                    <img
                      alt={item.product.name}
                      src="https://placehold.co/100x100/f1e0cd/556b2f?text=IMG"
                      className="w-full h-full object-contain mix-blend-multiply opacity-90"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#231a0f] text-sm">{item.product.name}</h4>
                    <p className="font-display text-sm text-[#3e5219] mt-1">{formatCurrency(item.product.sellingPrice)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-white border border-[#c5c8b8]/20 rounded-full px-1 py-2">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#75796b] hover:bg-[#f1e0cd]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#3e5219] hover:bg-[#f1e0cd]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#fff1e4] p-6 rounded-t-[32px] mt-auto">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-[#45483c]">
                <span>Subtotal</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-[#45483c]">
                <span>Discount (10%)</span>
                <span className="text-[#3e5219]">-{formatCurrency(getDiscount())}</span>
              </div>
              <div className="flex justify-between text-sm text-[#45483c]">
                <span>GST (5%)</span>
                <span>{formatCurrency(getTax())}</span>
              </div>
              <div className="pt-3 border-t border-[#c5c8b8]/20 flex justify-between items-center">
                <span className="font-display text-xl text-[#231a0f]">Total</span>
                <span className="font-display text-[32px] font-bold text-[#3e5219]">{formatCurrency(getTotal())}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl transition-all group",
                      isSelected
                        ? "bg-[#3e5219]/10 border-2 border-[#3e5219] text-[#3e5219]"
                        : "bg-white border-2 border-transparent hover:border-[#3e5219]/30 hover:bg-[#3e5219]/5"
                    )}
                  >
                    <Icon size={20} className={cn("mb-1", isSelected ? "text-[#3e5219]" : "text-[#75796b] group-hover:text-[#3e5219]")} />
                    <span className={cn("text-[11px]", isSelected ? "font-bold text-[#3e5219]" : "text-[#45483c] group-hover:text-[#3e5219]")}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className="w-full bg-[#3e5219] text-white font-display text-[18px] py-4 rounded-full shadow-soft-ambient hover:bg-[#556b2f] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="animate-spin">↻</span>
              ) : (
                <>
                  Pay {formatCurrency(getTotal())}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#c5c8b8]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d0eba1] flex items-center justify-center">
                  <Check size={20} className="text-[#3e5219]" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#231a0f]">Payment Successful</h3>
                  <p className="text-xs text-[#75796b]">{receiptData.orderNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReceipt(false)}
                className="p-2 hover:bg-[#f1e0cd] rounded-full transition-colors"
              >
                <X size={20} className="text-[#45483c]" />
              </button>
            </div>

            <div className="p-6" id="receipt-content">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl text-[#3e5219] mb-1">MartOS</h2>
                <p className="text-xs text-[#45483c]">Boutique Mart</p>
                <p className="text-xs text-[#45483c]">{receiptData.date}</p>
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
                    {receiptData.items.map((item, i) => (
                      <tr key={i} className="border-b border-[#c5c8b8]/10 last:border-0">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#45483c]">Subtotal</span>
                  <span className="text-[#231a0f]">{formatCurrency(receiptData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#45483c]">Discount</span>
                  <span className="text-[#3e5219]">-{formatCurrency(receiptData.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#45483c]">Tax (GST)</span>
                  <span className="text-[#231a0f]">{formatCurrency(receiptData.tax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#c5c8b8]/40">
                  <span className="font-display text-lg text-[#231a0f]">Total</span>
                  <span className="font-display text-xl text-[#3e5219]">{formatCurrency(receiptData.total)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#45483c]">Payment Method</span>
                  <span className="text-[#231a0f] uppercase">{receiptData.paymentMethod}</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-[#75796b]">Thank you for shopping with us!</p>
                <p className="text-xs text-[#75796b]">Please keep this receipt for your records.</p>
              </div>
            </div>

            <div className="p-6 border-t border-[#c5c8b8]/20 flex gap-3">
              <button 
                onClick={handlePrintReceipt}
                className="flex-1 bg-[#f1e0cd] text-[#231a0f] py-3 rounded-xl font-medium text-sm hover:bg-[#f7e5d3] transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button 
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-[#3e5219] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#556b2f] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}