import { create } from 'zustand';
import { CartItem, Product, User } from '@/types';
import { products } from '@/lib/data';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      set({
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || 'cashier',
        },
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    api.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

interface POSState {
  cart: CartItem[];
  currentOrderNumber: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  cart: [],
  currentOrderNumber: 8842,
  addToCart: (product: Product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1, discount: 0 }] });
    }
  },
  removeFromCart: (productId: string) => {
    const { cart } = get();
    set({ cart: cart.filter((item) => item.product.id !== productId) });
  },
  updateQuantity: (productId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      set({ cart: cart.filter((item) => item.product.id !== productId) });
    } else {
      set({
        cart: cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },
  applyDiscount: (productId: string, discount: number) => {
    const { cart } = get();
    set({
      cart: cart.map((item) =>
        item.product.id === productId ? { ...item, discount } : item
      ),
    });
  },
  clearCart: () => {
    set((state) => ({
      cart: [],
      currentOrderNumber: state.currentOrderNumber + 1,
    }));
  },
  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => {
      const itemTotal = item.product.sellingPrice * item.quantity;
      const discountAmount = item.discount
        ? (itemTotal * item.discount) / 100
        : 0;
      return sum + itemTotal - discountAmount;
    }, 0);
  },
  getDiscount: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 ? subtotal * 0.1 : 0; // 10% cart discount
  },
  getTax: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    return (subtotal - discount) * 0.05; // 5% GST
  },
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const tax = get().getTax();
    return subtotal - discount + tax;
  },
}));

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

interface ProductState {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: products,
  selectedCategory: 'All Products',
  searchQuery: '',
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));