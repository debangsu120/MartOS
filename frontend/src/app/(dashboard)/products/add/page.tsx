'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  Save, 
  Cloud,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isPerishable, setIsPerishable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sku: '',
    costPrice: '',
    sellingPrice: '',
    mrp: '',
    gstRate: '5',
    description: '',
    lowStockAlert: '10',
    initialStock: '',
    barcode: '',
    unit: 'pcs',
    rackLocation: '',
    shelfLocation: '',
    expiryDays: '',
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.sellingPrice || !formData.costPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createProduct({
        name: formData.name,
        categoryId: formData.categoryId || null,
        sku: formData.sku,
        barcode: formData.barcode || null,
        description: formData.description || null,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.sellingPrice),
        gstRate: parseFloat(formData.gstRate) || 0,
        lowStockAlert: parseInt(formData.lowStockAlert) || 10,
        unit: formData.unit,
        isPerishable,
        expiryDays: isPerishable ? parseInt(formData.expiryDays) || null : null,
        rackLocation: formData.rackLocation || null,
        shelfLocation: formData.shelfLocation || null,
        isActive: true,
      });
      
      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f4] flex flex-col">
      <Header 
        showNav={false}
        searchPlaceholder="Search products, SKUs..."
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fff8f4]">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#45483c] mb-2 text-sm">
                <Link href="/products" className="hover:text-[#3e5219] transition-colors">Products</Link>
                <span className="text-sm">›</span>
                <span className="text-[#231a0f]">Add New Product</span>
              </div>
              <h2 className="font-display text-xl text-[#231a0f]">Add New Product</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/products" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#6b4323] bg-[#f1e0cd] hover:bg-[#f7e5d3] transition-colors">
                Cancel
              </Link>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3e5219] hover:bg-[#556b2f] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <section className="bg-white rounded-[20px] p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow">
                  <h3 className="text-base text-[#231a0f] font-semibold mb-6 flex items-center gap-2 border-b border-[#c5c8b8]/30 pb-4">
                    <span className="text-[#3e5219]">ℹ</span> Basic Information
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div className="input-float">
                      <input 
                        id="name" 
                        placeholder=" " 
                        type="text" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Product Name *</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="input-float relative">
                        <select 
                          className="appearance-none bg-[#f1e0cd] border border-[#c5c8b8] rounded-lg w-full py-3 px-4 text-[#231a0f] focus:outline-none focus:border-[#3e5219]" 
                          id="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <label htmlFor="categoryId" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none">Category</label>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none" size={20} />
                      </div>
                      <div className="input-float relative">
                        <select 
                          className="appearance-none bg-[#f1e0cd] border border-[#c5c8b8] rounded-lg w-full py-3 px-4 text-[#231a0f] focus:outline-none focus:border-[#3e5219]" 
                          id="gstRate"
                          value={formData.gstRate}
                          onChange={handleChange}
                        >
                          <option value="0">0% GST</option>
                          <option value="5">5% GST</option>
                          <option value="12">12% GST</option>
                          <option value="18">18% GST</option>
                          <option value="28">28% GST</option>
                        </select>
                        <label htmlFor="gstRate" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none">GST Rate</label>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none" size={20} />
                      </div>
                    </div>
                    <div className="input-float">
                      <textarea 
                        className="resize-none" 
                        id="description" 
                        placeholder=" " 
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                      <label htmlFor="description">Product Description</label>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-[20px] p-6 shadow-soft-ambient hover:shadow-hover-lift transition-shadow">
                  <h3 className="text-base text-[#231a0f] font-semibold mb-6 flex items-center gap-2 border-b border-[#c5c8b8]/30 pb-4">
                    <span className="text-[#3e5219]">💰</span> Pricing & Inventory
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="input-float">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45483c] font-semibold mt-1">₹</span>
                      <input 
                        className="pl-8" 
                        id="sellingPrice" 
                        placeholder=" " 
                        type="number" 
                        step="0.01"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        required
                      />
                      <label className="ml-4" htmlFor="sellingPrice">Selling Price *</label>
                    </div>
                    <div className="input-float">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45483c] font-semibold mt-1">₹</span>
                      <input 
                        className="pl-8" 
                        id="costPrice" 
                        placeholder=" " 
                        type="number" 
                        step="0.01"
                        value={formData.costPrice}
                        onChange={handleChange}
                        required
                      />
                      <label className="ml-4" htmlFor="costPrice">Cost Price *</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="input-float">
                      <input 
                        id="sku" 
                        placeholder=" " 
                        type="text" 
                        value={formData.sku}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="sku">SKU Code *</label>
                    </div>
                    <div className="input-float">
                      <input 
                        id="lowStockAlert" 
                        placeholder=" " 
                        type="number"
                        value={formData.lowStockAlert}
                        onChange={handleChange}
                      />
                      <label htmlFor="lowStockAlert">Low Stock Alert</label>
                    </div>
                    <div className="input-float">
                      <input 
                        id="barcode" 
                        placeholder=" " 
                        type="text"
                        value={formData.barcode}
                        onChange={handleChange}
                      />
                      <label htmlFor="barcode">Barcode</label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-[20px] p-6 shadow-soft-ambient h-fit hover:shadow-hover-lift transition-shadow">
                  <h3 className="text-base text-[#231a0f] font-semibold mb-4 flex items-center gap-2">
                    <span className="text-[#3e5219]">🖼️</span> Product Media
                  </h3>
                  <div className="border-2 border-dashed border-[#3e5219]/40 rounded-[20px] bg-[#fff1e4] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f7e5d3] transition-colors group">
                    <div className="w-16 h-16 bg-[#f1e0cd] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Cloud size={32} className="text-[#3e5219]" />
                    </div>
                    <p className="text-sm font-semibold text-[#231a0f] mb-1">Click or drag image to upload</p>
                    <p className="text-xs text-[#45483c]">PNG, JPG up to 5MB</p>
                  </div>
                </section>

                <section className="bg-white rounded-[20px] p-6 shadow-soft-ambient h-fit hover:shadow-hover-lift transition-shadow">
                  <h3 className="text-base text-[#231a0f] font-semibold mb-6 flex items-center gap-2 border-b border-[#c5c8b8]/30 pb-4">
                    <span className="text-[#3e5219]">📍</span> Logistics & Placement
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="input-float">
                        <input 
                          id="rackLocation" 
                          placeholder=" " 
                          type="text"
                          value={formData.rackLocation}
                          onChange={handleChange}
                        />
                        <label htmlFor="rackLocation">Rack (e.g. A-1)</label>
                      </div>
                      <div className="input-float">
                        <input 
                          id="shelfLocation" 
                          placeholder=" " 
                          type="text"
                          value={formData.shelfLocation}
                          onChange={handleChange}
                        />
                        <label htmlFor="shelfLocation">Shelf (e.g. Top)</label>
                      </div>
                    </div>
                    <div className="input-float relative">
                      <select 
                        className="appearance-none bg-[#f1e0cd] border border-[#c5c8b8] rounded-lg w-full py-3 px-4 text-[#231a0f] focus:outline-none focus:border-[#3e5219]" 
                        id="unit"
                        value={formData.unit}
                        onChange={handleChange}
                      >
                        <option value="pcs">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="g">Grams</option>
                        <option value="l">Liters</option>
                        <option value="ml">Milliliters</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                      </select>
                      <label htmlFor="unit" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none">Unit</label>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45483c] pointer-events-none" size={20} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#fff1e4] rounded-xl mt-2">
                      <div>
                        <p className="text-sm font-semibold text-[#231a0f]">Perishable Item</p>
                        <p className="text-xs text-[#45483c]">Requires expiry date tracking</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          className="sr-only peer" 
                          type="checkbox" 
                          value="" 
                          checked={isPerishable}
                          onChange={(e) => setIsPerishable(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[#c5c8b8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3e5219]"></div>
                      </label>
                    </div>
                    {isPerishable && (
                      <div className="input-float">
                        <input 
                          id="expiryDays" 
                          placeholder=" " 
                          type="number"
                          value={formData.expiryDays}
                          onChange={handleChange}
                        />
                        <label htmlFor="expiryDays">Expiry Days</label>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}