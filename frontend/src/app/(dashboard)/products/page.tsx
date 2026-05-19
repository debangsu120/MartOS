'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Filter,
  Grid,
  List,
  Edit,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: string;
  costPrice: string;
  category?: { name: string };
  inventory?: { quantity: number; rackLocation: string | null; shelfLocation: string | null }[];
  imageUrl?: string;
  isActive: boolean;
  status?: string;
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData.items || productsData);
        setCategories([{ id: 'all', name: 'All Items' }, ...categoriesData.map((c: any) => ({ id: c.id, name: c.name }))]);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fff8f4] flex flex-col">
      <Header 
        showNav={false}
        searchPlaceholder="Search product catalog..."
      />

      {/* Page Canvas */}
      <div className="p-6 md:p-8 w-full max-w-[1440px] mx-auto flex flex-col gap-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-xl text-[#231a0f] mb-1">Product Catalog</h1>
            <p className="text-sm text-[#45483c]">Manage inventory, pricing, and availability across all categories.</p>
          </div>
          <Link href="/products/add" className="bg-[#3e5219] text-white text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm whitespace-nowrap">
            <Plus size={20} /> Add Product
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-soft-ambient flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#f1e0cd]">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#3e5219] text-white shadow-sm"
                    : "bg-[#f1e0cd] text-[#45483c] hover:bg-[#f7e5d3]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Secondary Filters & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center px-3 py-1.5 bg-[#f1e0cd] rounded-lg border border-[#c5c8b8]/30">
              <Filter size={16} className="text-[#45483c] mr-2" />
              <select className="bg-transparent border-none text-[#231a0f] text-sm py-0 pl-0 pr-6 focus:ring-0 cursor-pointer appearance-none outline-none">
                <option>Status: Any</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="flex bg-[#f1e0cd] rounded-lg p-1 border border-[#c5c8b8]/30 hidden md:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#3e5219]' : 'text-[#45483c] hover:bg-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#3e5219]' : 'text-[#45483c] hover:bg-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-soft-ambient overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(85,107,47,0.1)] transition-all duration-300 border border-[#f1e0cd] group"
            >
              <div className="aspect-square relative bg-[#fff1e4] overflow-hidden">
                <img
                  alt={product.name}
                  src={`https://placehold.co/400x400/f1e0cd/556b2f?text=${encodeURIComponent(product.name.slice(0, 10))}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  {(() => {
                    const qty = product.inventory?.[0]?.quantity || 0;
                    const status = qty > 20 ? 'in_stock' : qty > 0 ? 'low_stock' : 'out_of_stock';
                    return (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        status === 'in_stock' 
                          ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]' 
                          : status === 'low_stock'
                          ? 'bg-[#fff3e0] text-[#e65100] border border-[#ffe0b2]'
                          : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffcdd2]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === 'in_stock' ? 'bg-[#4caf50]' : status === 'low_stock' ? 'bg-[#ff9800]' : 'bg-[#f44336]'
                        }`}></span>
                        {status === 'in_stock' ? 'In Stock' : status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    );
                  })()}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="p-1.5 bg-white/90 backdrop-blur text-[#231a0f] rounded-lg shadow-sm hover:text-[#3e5219] transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-[#45483c] mb-1">SKU: {product.sku}</span>
                <h3 className="text-base text-[#231a0f] font-semibold mb-2 line-clamp-1">{product.name}</h3>
                {product.inventory?.[0]?.rackLocation && (
                  <span className="text-xs text-[#6b4323] mb-1 bg-[#f1e0cd] px-2 py-0.5 rounded inline-block w-fit">
                    📍 {product.inventory[0].rackLocation}{product.inventory[0].shelfLocation && ` / ${product.inventory[0].shelfLocation}`}
                  </span>
                )}
                <div className="mt-auto flex items-end justify-between">
                  <span className="font-display text-xl text-[#3e5219]">{formatCurrency(Number(product.sellingPrice))}</span>
                  <span className="text-sm text-[#45483c]">{product.inventory?.[0]?.quantity || 0} units</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-[#45483c] hover:bg-[#f7e5d3] transition-colors disabled:opacity-50">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <span className="text-sm text-[#45483c] px-4 py-2">Page 1 of 12</span>
            <button className="p-2 rounded-lg text-[#231a0f] hover:bg-[#f7e5d3] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}