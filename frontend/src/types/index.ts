export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'cashier' | 'inventory';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  category: string;
  brand?: string;
  costPrice: number;
  sellingPrice: number;
  mrp?: number;
  gstRate?: number;
  image?: string;
  quantity: number;
  lowStockAlert: number;
  rackLocation?: string;
  shelfLocation?: string;
  isPerishable?: boolean;
  expiryDate?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Category {
  id: string;
  name: string;
  productsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  createdAt: string;
  cashier: User;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'add' | 'remove' | 'adjustment';
  quantity: number;
  reason?: string;
  createdAt: string;
  createdBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  productsSupplied: number;
  totalOrders: number;
  balance: number;
}

export interface DashboardStats {
  todaySales: number;
  todaySalesChange: number;
  ordersToday: number;
  ordersChange: number;
  lowStockItems: number;
  avgMargin: number;
  marginChange: number;
}

export interface SalesData {
  day: string;
  revenue: number;
  profit: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  revenue: number;
  sold: number;
}

export interface InventoryAlert {
  id: string;
  productName: string;
  quantity: number;
  status: 'critical' | 'low';
}