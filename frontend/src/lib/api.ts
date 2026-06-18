const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('martos_token', token);
      } else {
        localStorage.removeItem('martos_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('martos_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async register(email: string, password: string, name: string, phone?: string) {
    const data = await this.request<{ accessToken: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Products
  async getProducts(params?: { categoryId?: string; search?: string; isFeatured?: boolean }) {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.isFeatured) query.set('isFeatured', 'true');
    return this.request<any>(`/products?${query}`);
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request<any>('/products', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, { method: 'DELETE' });
  }

  async getCategories(parentId?: string) {
    const query = parentId ? `?parentId=${parentId}` : '';
    return this.request<any[]>(`/products/categories${query}`);
  }

  async createCategory(data: any) {
    return this.request<any>('/products/categories', { method: 'POST', body: JSON.stringify(data) });
  }

  // Inventory
  async getInventory(params?: { search?: string; lowStock?: boolean }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.lowStock) query.set('lowStock', 'true');
    return this.request<any[]>(`/inventory?${query}`);
  }

  async getInventorySummary() {
    return this.request<any>('/inventory/summary');
  }

  async getLowStock() {
    return this.request<any[]>('/inventory/low-stock');
  }

  async adjustStock(productId: string, data: { type: string; quantity: number; reason?: string; notes?: string }) {
    return this.request<any>(`/inventory/${productId}/adjust`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Sales
  async createSale(data: { items: any[]; paymentMethod: string; customerId?: string; notes?: string }) {
    return this.request<any>('/sales', { method: 'POST', body: JSON.stringify(data) });
  }

  async getSales(params?: { startDate?: string; endDate?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.status) query.set('status', params.status);
    return this.request<any[]>(`/sales?${query}`);
  }

  async getDailySales(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<any>(`/sales/daily${query}`);
  }

  async voidSale(id: string, reason: string) {
    return this.request<any>(`/sales/${id}/void`, { method: 'PATCH', body: JSON.stringify({ reason }) });
  }

  // Reports
  async getDashboard(startDate?: string, endDate?: string) {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    return this.request<any>(`/reports/dashboard?${query}`);
  }

  async getSalesTrend(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<any[]>(`/reports/sales-trend${query}`);
  }

  async getTopProducts(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<any[]>(`/reports/top-products${query}`);
  }

  async getCategorySales(startDate?: string, endDate?: string) {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    return this.request<any[]>(`/reports/categories?${query}`);
  }

  async getHourlySales(date?: string) {
    const query = date ? `?date=${date}` : '';
    return this.request<any[]>(`/reports/hourly${query}`);
  }

  async getInventoryValue() {
    return this.request<any>('/reports/inventory-value');
  }

  // Suppliers
  async getSuppliers(search?: string) {
    const query = search ? `?search=${search}` : '';
    return this.request<any[]>(`/suppliers${query}`);
  }

  async getSupplier(id: string) {
    return this.request<any>(`/suppliers/${id}`);
  }

  async createSupplier(data: any) {
    return this.request<any>('/suppliers', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateSupplier(id: string, data: any) {
    return this.request<any>(`/suppliers/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteSupplier(id: string) {
    return this.request<any>(`/suppliers/${id}`, { method: 'DELETE' });
  }

  // Purchase Orders
  async getPurchaseOrders(params?: { supplierId?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.supplierId) query.set('supplierId', params.supplierId);
    if (params?.status) query.set('status', params.status);
    return this.request<any[]>(`/suppliers/purchase-orders?${query}`);
  }

  async createPurchaseOrder(data: any) {
    return this.request<any>('/suppliers/purchase-orders', { method: 'POST', body: JSON.stringify(data) });
  }

  async receivePurchaseOrder(id: string, data: { receivedItems: any[] }) {
    return this.request<any>(`/suppliers/purchase-orders/${id}/receive`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Notifications
  async getNotifications(unreadOnly?: boolean) {
    const query = unreadOnly ? '?unread=true' : '';
    return this.request<any[]>(`/notifications${query}`);
  }

  async getUnreadCount() {
    return this.request<number>('/notifications/unread-count');
  }

  async markAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllAsRead() {
    return this.request<any>('/notifications/read-all', { method: 'PATCH' });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async getStoreInfo() {
    return this.request<any>('/settings/store');
  }

  async updateStore(data: any) {
    return this.request<any>('/settings/store', { method: 'PATCH', body: JSON.stringify(data) });
  }

  async setSetting(key: string, value: any) {
    return this.request<any>(`/settings/${key}`, { method: 'POST', body: JSON.stringify({ value }) });
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getRoles() {
    return this.request<any[]>('/users/roles');
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request<any>('/users', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  // Stores
  async getStores() {
    return this.request<any[]>('/stores');
  }

  async getStore(id: string) {
    return this.request<any>(`/stores/${id}`);
  }

  async createStore(data: any) {
    return this.request<any>('/stores', { method: 'POST', body: JSON.stringify(data) });
  }
}

export const api = new ApiClient();