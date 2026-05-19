import { 
  Product, 
  Category, 
  User, 
  Sale, 
  Supplier, 
  DashboardStats, 
  SalesData, 
  TopProduct, 
  InventoryAlert,
  CartItem 
} from '@/types';

// Mock User
export const currentUser: User = {
  id: '1',
  name: 'Arjun K.',
  email: 'manager@boutiquemart.com',
  role: 'manager',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChSq7VjFSIvuAp2e2n8GAABj296_ffoyWuaZxPUtzWbWKMoL24JXX99czygTnCc4FDGlTL64SnsQaJd3GkvUmxN6_6fU6C0zU205I05j2a1w8M98uJ1Y4OEIHRcdzwzPkWuhJxB4x-KMjfr-ttbcE_WTn8Fmuxwf9zj4e3XQSu76G16zN4yZpkpAtMuAHDd-jsbqPSTfMFJiWr2Bzj_JA_1HwZZ91vICyU6HTZJyMZMkf58dYJxaYUejanYoW_RXLbTlJQB951m1Ne'
};

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'All Products', productsCount: 156 },
  { id: '2', name: 'Best Sellers', productsCount: 42 },
  { id: '3', name: 'Millet Snacks', productsCount: 28 },
  { id: '4', name: 'Diabetic Friendly', productsCount: 35 },
  { id: '5', name: 'Satvik Vegan', productsCount: 22 },
];

export const productCategories = [
  'Dairy & Alternatives',
  'Fresh Produce',
  'Pantry Staples',
  'Snacks & Beverages',
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Roasted Chana Jor',
    sku: 'SNK-001',
    barcode: '1234567890',
    category: 'Snacks & Beverages',
    brand: 'Organic Farms Co.',
    costPrice: 120,
    sellingPrice: 180,
    mrp: 199,
    gstRate: 5,
    quantity: 42,
    lowStockAlert: 20,
    rackLocation: 'B-04',
    shelfLocation: 'Shelf 1',
    status: 'in_stock',
  },
  {
    id: '2',
    name: 'High Fibre Millet Mix',
    sku: 'MLT-050',
    barcode: '1234567891',
    category: 'Millet Snacks',
    brand: 'Nature\'s Path',
    costPrice: 150,
    sellingPrice: 220,
    mrp: 249,
    gstRate: 5,
    quantity: 18,
    lowStockAlert: 25,
    rackLocation: 'A-12',
    shelfLocation: 'Shelf 3',
    status: 'low_stock',
  },
  {
    id: '3',
    name: 'High Protein Moong Jor',
    sku: 'SNK-002',
    barcode: '1234567892',
    category: 'Snacks & Beverages',
    brand: 'Local Harvest',
    costPrice: 120,
    sellingPrice: 180,
    mrp: 199,
    gstRate: 5,
    quantity: 56,
    lowStockAlert: 20,
    rackLocation: 'B-05',
    shelfLocation: 'Shelf 2',
    status: 'in_stock',
  },
  {
    id: '4',
    name: 'Chola Fadi Khakhra',
    sku: 'BKY-112',
    barcode: '1234567893',
    category: 'Snacks & Beverages',
    brand: 'In-House Brand',
    costPrice: 110,
    sellingPrice: 170,
    mrp: 189,
    gstRate: 5,
    quantity: 105,
    lowStockAlert: 30,
    rackLocation: 'B-05',
    shelfLocation: 'Shelf 2',
    status: 'in_stock',
  },
  {
    id: '5',
    name: 'Premium Organic Millet',
    sku: 'MIL-ORG-001',
    barcode: '1234567894',
    category: 'Pantry Staples',
    brand: 'Organic Farms Co.',
    costPrice: 100,
    sellingPrice: 180,
    mrp: 199,
    gstRate: 0,
    quantity: 450,
    lowStockAlert: 50,
    rackLocation: 'A-12',
    shelfLocation: 'Shelf 3',
    status: 'in_stock',
  },
  {
    id: '6',
    name: 'Roasted Makhana',
    sku: 'SNK-003',
    barcode: '1234567895',
    category: 'Diabetic Friendly',
    brand: 'Nature\'s Path',
    costPrice: 200,
    sellingPrice: 350,
    mrp: 399,
    gstRate: 5,
    quantity: 2,
    lowStockAlert: 15,
    rackLocation: 'C-01',
    shelfLocation: 'Shelf 1',
    status: 'out_of_stock',
  },
  {
    id: '7',
    name: 'Moong Dal 1kg',
    sku: 'PTR-001',
    barcode: '1234567896',
    category: 'Pantry Staples',
    brand: 'Local Harvest',
    costPrice: 80,
    sellingPrice: 120,
    mrp: 139,
    gstRate: 0,
    quantity: 8,
    lowStockAlert: 20,
    rackLocation: 'A-08',
    shelfLocation: 'Shelf 2',
    status: 'low_stock',
  },
  {
    id: '8',
    name: 'Jaggery Powder',
    sku: 'PTR-002',
    barcode: '1234567897',
    category: 'Pantry Staples',
    brand: 'In-House Brand',
    costPrice: 50,
    sellingPrice: 85,
    mrp: 99,
    gstRate: 0,
    quantity: 12,
    lowStockAlert: 15,
    rackLocation: 'A-10',
    shelfLocation: 'Shelf 1',
    status: 'low_stock',
  },
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Green Valley Distributors',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@greenvalley.com',
    phone: '+91 9876543210',
    address: '123 Market Road, Chennai',
    productsSupplied: 45,
    totalOrders: 234,
    balance: 45000,
  },
  {
    id: '2',
    name: 'AgriCorp India',
    contactPerson: 'Priya Sharma',
    email: 'priya@agricorp.in',
    phone: '+91 9876543211',
    address: '456 Industrial Area, Mumbai',
    productsSupplied: 32,
    totalOrders: 156,
    balance: 28000,
  },
  {
    id: '3',
    name: 'Local Artisan Co-op',
    contactPerson: 'Vikram Singh',
    email: 'vikram@localartisan.coop',
    phone: '+91 9876543212',
    address: '789 Village Road, Pune',
    productsSupplied: 18,
    totalOrders: 89,
    balance: 12000,
  },
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  todaySales: 45230,
  todaySalesChange: 12.5,
  ordersToday: 142,
  ordersChange: 8.2,
  lowStockItems: 18,
  avgMargin: 24.5,
  marginChange: 0,
};

// Mock Sales Data (last 7 days)
export const salesData: SalesData[] = [
  { day: 'Mon', revenue: 16000, profit: 4000 },
  { day: 'Tue', revenue: 26000, profit: 6500 },
  { day: 'Wed', revenue: 34000, profit: 8500 },
  { day: 'Thu', revenue: 22000, profit: 5500 },
  { day: 'Fri', revenue: 28000, profit: 7000 },
  { day: 'Sat', revenue: 38000, profit: 9500 },
  { day: 'Sun', revenue: 20000, profit: 5000 },
];

// Mock Top Products
export const topProducts: TopProduct[] = [
  {
    id: '1',
    name: 'Organic Chana Jor',
    sku: 'SNK-001',
    quantity: 42,
    revenue: 12450,
    sold: 124,
  },
  {
    id: '2',
    name: 'Millet Mix 500g',
    sku: 'MLT-050',
    quantity: 18,
    revenue: 8900,
    sold: 89,
  },
  {
    id: '3',
    name: 'Premium Khakhra',
    sku: 'BKY-112',
    quantity: 105,
    revenue: 5200,
    sold: 65,
  },
];

// Mock Inventory Alerts
export const inventoryAlerts: InventoryAlert[] = [
  {
    id: '1',
    productName: 'Roasted Makhana',
    quantity: 2,
    status: 'critical',
  },
  {
    id: '2',
    productName: 'Moong Dal 1kg',
    quantity: 8,
    status: 'low',
  },
  {
    id: '3',
    productName: 'Jaggery Powder',
    quantity: 12,
    status: 'low',
  },
];

// Mock POS Cart
export const mockCartItems: CartItem[] = [
  {
    product: products[0],
    quantity: 1,
    discount: 0,
  },
  {
    product: products[3],
    quantity: 2,
    discount: 10,
  },
];

// Inventory table data
export const inventoryData = [
  {
    id: '1',
    product: products[4],
    sku: 'MIL-ORG-001',
    rack: 'A-12-Shelf 3',
    quantity: 450,
    status: 'In Stock',
    price: 180,
  },
  {
    id: '2',
    product: products[0],
    sku: 'SNK-001',
    rack: 'B-04-Shelf 1',
    quantity: 12,
    status: 'Low Stock',
    price: 120,
  },
  {
    id: '3',
    product: products[3],
    sku: 'BKY-112',
    rack: 'B-05-Shelf 2',
    quantity: 210,
    status: 'In Stock',
    price: 170,
  },
];

// Reports data
export const reportsStats = {
  totalRevenue: 4250000,
  revenueChange: 12.5,
  grossProfit: 1870000,
  profitChange: 8.2,
  netMargin: 44.0,
  marginChange: 0,
  avgOrderValue: 2450,
  avgOrderChange: 5.1,
};

export const reportsSalesData = [
  { day: 'Mon', revenue: 50000, profit: 20000 },
  { day: 'Tue', revenue: 65000, profit: 26000 },
  { day: 'Wed', revenue: 55000, profit: 22000 },
  { day: 'Thu', revenue: 80000, profit: 32000 },
  { day: 'Fri', revenue: 75000, profit: 30000 },
  { day: 'Sat', revenue: 95000, profit: 38000 },
  { day: 'Sun', revenue: 105000, profit: 42000 },
];

export const categoryPerformance = [
  { name: 'Organic Staples', percentage: 42 },
  { name: 'Fresh Produce', percentage: 28 },
  { name: 'Artisanal Snacks', percentage: 18 },
  { name: 'Dairy & Alt', percentage: 12 },
];