# MartOS Application Documentation

## Table of Contents
1. [Login Page](#1-login-page)
2. [Dashboard](#2-dashboard)
3. [Products Page](#3-products-page)
4. [Add Product Page](#4-add-product-page)
5. [POS (Point of Sale)](#5-pos-point-of-sale)
6. [Inventory Page](#6-inventory-page)
7. [Reports Page](#7-reports-page)
8. [Suppliers Page](#8-suppliers-page)
9. [Users Page](#9-users-page)
10. [Settings Page](#10-settings-page)

---

## 1. Login Page

**File:** `frontend/src/app/login/page.tsx`

### Overview
The login page is the entry point to MartOS. It provides secure authentication for users with JWT-based tokens.

### Frontend Features
- Email and password input fields
- Password visibility toggle (show/hide)
- "Remember me" checkbox (stores preference locally)
- Forgot password link
- Mobile-responsive split layout (branding left, form right)
- Error toast notifications for failed login attempts
- Success navigation to dashboard on successful login

### Frontend API Call
```typescript
api.login(email: string, password: string)
// Returns: { accessToken: string, user: { id, email, name, role, stores } }
// Token stored in localStorage as 'martos_token'
```

### Backend Endpoints

**POST /api/v1/auth/login**
- **Request Body:** `{ email: string, password: string }`
- **Response:** `{ accessToken: string, refreshToken: string, expiresIn: number, user: { id, email, name, role, stores: [] } }`
- **Features:**
  - Validates credentials with bcrypt
  - Returns JWT with user role and storeId
  - Creates audit log entry for login event
  - Creates session record
  - Updates lastLoginAt timestamp

**POST /api/v1/auth/register**
- **Request Body:** `{ email: string, password: string, name: string, phone?: string }`
- **Response:** `{ message: string, userId: string }`
- **Features:**
  - Hashes password with bcrypt (12 rounds)
  - Creates user with default 'cashier' role
  - Creates audit log entry

### Authentication Flow
1. User enters email/password
2. Frontend calls `api.login()`
3. Backend validates credentials
4. Backend creates audit log entry (LOGIN action)
5. Backend creates session record
6. Backend returns accessToken + refreshToken + user info
7. Frontend stores token in localStorage
8. Frontend redirects to /dashboard
9. All subsequent API calls include `Authorization: Bearer <token>`

---

## 2. Dashboard

**File:** `frontend/src/app/(dashboard)/dashboard/page.tsx`

### Overview
The dashboard is the main overview page showing KPIs, sales trends, and quick actions. It displays real-time data from the backend.

### Frontend Features
- **Category Pills:** Overview, Live Feed, Store Analytics, Inventory Status (navigation only)
- **KPI Cards (Bento Grid):**
  - Today's Sales (with % change indicator)
  - Orders (with % change indicator)
  - Low Stock Items (with "View All" link)
  - Avg Margin (percentage)
- **Revenue Trends Chart:** Bar chart showing last 7 days revenue with hover tooltips
- **Quick Actions Panel:**
  - New POS Sale (links to /pos)
  - Receive Stock (links to /inventory)
  - Add Product (links to /products/add)
- **Top Performers Section:** List of top 5 selling products with revenue
- **Inventory Alerts Section:** Table showing low stock items with reorder action

### Frontend API Calls
```typescript
api.getDashboard() // Returns: { revenue: { total, tax, discount }, profit: { amount, margin }, orders: { total, averageValue }, products: { total, lowStock } }

api.getSalesTrend(7) // Returns: [{ date: string, revenue: number }]

api.getTopProducts(5) // Returns: [{ productId, name, quantity, revenue }]

api.getLowStock() // Returns: [{ id, name, quantity, lowStockAlert }]
```

### Backend Endpoints

**GET /api/v1/reports/dashboard**
- **Query Params:** `startDate?: string, endDate?: string`
- **Response:** Dashboard metrics object
- **Features:**
  - Calculates total revenue, tax, discount from completed sales
  - Calculates profit (revenue - tax - cost)
  - Counts total orders and average order value
  - Counts products and low stock items

**GET /api/v1/reports/sales-trend**
- **Query Params:** `days?: number` (default 7)
- **Response:** Array of `{ date: string, revenue: number }`
- **Features:**
  - Groups sales by day for specified period
  - Returns daily totals in chronological order

**GET /api/v1/reports/top-products**
- **Query Params:** `limit?: number, startDate?: string, endDate?: string`
- **Response:** Array of `{ productId, name, quantity, revenue }`
- **Features:**
  - Aggregates sales by product
  - Sorts by revenue descending
  - Returns top N products

**GET /api/v1/inventory/low-stock**
- **Response:** Array of products with inventory quantity <= lowStockAlert
- **Features:**
  - Filters products where quantity <= lowStockAlert
  - Includes inventory data

---

## 3. Products Page

**File:** `frontend/src/app/(dashboard)/products/page.tsx`

### Overview
Displays the product catalog in a grid view with filtering, searching, and category-based navigation.

### Frontend Features
- **Search Bar:** Filters products by name or SKU
- **Category Pills:** Horizontal scrollable category filters (All Products + dynamic categories)
- **Status Filter:** Dropdown for status filtering (Any, In Stock, Low Stock, Out of Stock)
- **View Toggle:** Grid/List view toggle buttons
- **Product Cards:** 
  - Product image (placeholder)
  - Badge showing stock status (In Stock, Low Stock, Out of Stock)
  - Product name
  - SKU code
  - **Rack/Shelf Location** (displayed if set)
  - Selling price
  - Current inventory quantity
  - Edit button (hover reveal)
- **Pagination:** Page navigation at bottom

### Frontend API Calls
```typescript
api.getProducts(params?: { categoryId?, search?, isFeatured? })
// Returns: { items: Product[], total: number, page: number, limit: number }
// OR: Product[] (when no pagination)

api.getCategories()
// Returns: [{ id: string, name: string }]
```

### Backend Endpoints

**GET /api/v1/products**
- **Query Params:** 
  - `page?: number` (default 1)
  - `limit?: number` (default 20)
  - `search?: string` (searches name, SKU, barcode with fuzzy matching)
  - `categoryId?: string`
  - `isFeatured?: boolean`
  - `isActive?: boolean` (default true)
- **Response:** `{ items: Product[], total: number, page: number, limit: number }`
- **Features:**
  - Includes category and inventory data
  - Fuzzy search using contains + startsWith
  - Ordered by createdAt descending

**GET /api/v1/products/categories**
- **Query Params:** `parentId?: string`
- **Response:** Array of Category objects
- **Features:**
  - Returns all active categories for the user's store

**Product Schema (returned):**
```typescript
{
  id: string,
  name: string,
  sku: string,
  sellingPrice: Decimal,
  costPrice: Decimal,
  barcode: string | null,
  description: string | null,
  imageUrl: string | null,
  isActive: boolean,
  isFeatured: boolean,
  category: { id, name } | null,
  inventory: [{ 
    quantity: number,
    rackLocation: string | null,
    shelfLocation: string | null
  }]
}
```

---

## 4. Add Product Page

**File:** `frontend/src/app/(dashboard)/products/add/page.tsx`

### Overview
Form page for creating new products with complete product details including pricing, inventory settings, and logistics.

### Frontend Features
- **Breadcrumb Navigation:** Products > Add New Product
- **Cancel/Submit Buttons:** Cancel returns to products list
- **Basic Information Section:**
  - Product Name (required)
  - Category (dropdown from API)
  - GST Rate (dropdown: 0%, 5%, 12%, 18%, 28%)
  - Description (textarea)
- **Pricing & Inventory Section:**
  - Selling Price (required)
  - Cost Price (required)
  - SKU Code (required)
  - Low Stock Alert (number)
  - Barcode
- **Logistics & Placement Section:**
  - **Rack Location** (text input, e.g., "A-1")
  - **Shelf Location** (text input, e.g., "Top")
  - Unit (dropdown: pieces, kg, g, l, ml, box, pack)
  - **Perishable Item Toggle** (enables expiry tracking)
  - **Expiry Days** (shown when perishable, number input)
- **Product Media Section:** Upload placeholder UI (click/drag area)
- **Toast Notifications:** Success/error feedback
- **Loading States:** Submit button shows spinner during save

### Frontend API Calls
```typescript
api.getCategories() // Load categories for dropdown

api.createProduct(data: {
  name: string,
  categoryId: string | null,
  sku: string,
  barcode: string | null,
  description: string | null,
  costPrice: number,
  sellingPrice: number,
  mrp: number,
  gstRate: number,
  lowStockAlert: number,
  unit: string,
  isPerishable: boolean,
  expiryDays: number | null,
  rackLocation: string | null,
  shelfLocation: string | null,
  isActive: boolean
})
```

### Backend Endpoints

**POST /api/v1/products**
- **Request Body:** Product object with all fields
- **Response:** Created Product object
- **Features:**
  - Generates slug from name
  - Creates product linked to user's storeId
  - Automatically creates Inventory record with initial stock and rack/shelf location

**GET /api/v1/products/categories**
- **Used for:** Populating category dropdown

### Special Features
- **Rack & Shelf Mapping:** Stored in Inventory table, displayed on product cards
- **Expiry Tracking:** `expiryDays` stored on Product, used for perishable item tracking
- **Auto-Inventory Creation:** When product is created, inventory record is also created with quantity=0 (or initialStock if provided)

---

## 5. POS (Point of Sale)

**File:** `frontend/src/app/(dashboard)/pos/page.tsx`

### Overview
The POS terminal for processing sales transactions. Features product search, cart management, and payment processing with digital receipt generation.

### Frontend Features
- **Header Bar:** Sync Data button, Quick Add button
- **Left Panel - Product Discovery:**
  - Barcode Scanner Input (searches by name, SKU, barcode)
  - Category Pills (horizontal scroll)
  - Product Grid: Cards with image, name, price, quick-add button
  - Category/featured badges on cards
- **Right Panel - Cart & Billing:**
  - Current Order header with item count
  - Clear Cart button (with confirmation for non-empty cart)
  - Cart Items List: Product image, name, price, quantity controls (+/-)
  - **Billing Summary:**
    - Subtotal
    - Discount (10% cart discount - predefined)
    - GST (5%)
    - Total
  - Payment Method Selector: Cash, Card, UPI, Wallet (icon buttons)
  - Pay Button (disabled if cart empty)
- **Digital Receipt Modal:**
  - Appears after successful sale
  - Shows: Order number, date/time, itemized list, totals
  - Payment method indicator
  - Print button (browser print)
  - Done button (closes modal, clears cart)
- **Error Handling:** Toast notifications for failed sales

### Frontend API Calls
```typescript
api.getProducts()
// Returns all products for store (used for grid display)

api.getCategories()
// Returns categories for filter pills

api.createSale(data: {
  items: Array<{ productId: string, quantity: number, discountPercent?: number }>,
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet',
  customerId?: string,
  notes?: string
})
// Returns: Sale object with orderNumber
```

### Backend Endpoints

**POST /api/v1/sales**
- **Request Body:** Sale creation object
- **Response:** Created Sale object with orderNumber
- **Features:**
  - Validates product availability (checks inventory)
  - Calculates per-item totals with GST and discounts
  - Calculates subtotal, discount, tax, totalAmount
  - Updates inventory quantities
  - Creates SaleItem records
  - Transaction-safe (rollback on error)

### Sale Flow
1. User adds products to cart
2. User selects payment method
3. User clicks "Pay"
4. Frontend calls `api.createSale()` with cart items
5. Backend:
   - Validates stock for each item
   - Calculates totals
   - Decreases inventory quantities
   - Creates sale record
   - Creates sale item records
6. On success: Frontend shows receipt modal
7. User can print or dismiss receipt

---

## 6. Inventory Page

**File:** `frontend/src/app/(dashboard)/inventory/page.tsx`

### Overview
Comprehensive inventory management with real-time stock levels, location mapping, stock adjustments, and history tracking.

### Frontend Features
- **Stats Cards (Bento Grid):**
  - Total Inventory Value (sum of quantity × sellingPrice)
  - Low Stock Items (count with alert styling)
  - Recent Stock Movement (bar chart placeholder)
- **Stock History Button:** Opens modal with all adjustment logs
- **Action Buttons:** Bulk Import, Export List, Add Product
- **Search Bar:** Filters by product name or SKU
- **Filter Pills:** All Inventory, Low Stock, Expiring Soon
- **Inventory Table Columns:**
  - Product (image, name, category)
  - SKU
  - **Location** (rack/shelf display)
  - Quantity (with progress bar)
  - Status (In Stock / Low Stock badge)
  - Price
  - Actions (adjust stock button)
- **Stock Adjustment Modal:**
  - Shows product info and current stock
  - Add/Remove Stock toggle buttons
  - Quantity input (required)
  - Reason dropdown (restock, sale, return, damage, correction, transfer, other)
  - Notes textarea (optional)
  - Cancel/Confirm buttons
- **Stock History Modal:**
  - Lists all stock adjustments
  - Shows type icon (add=green, remove=red)
  - Product name, reason, notes
  - Quantity change (+/-)
  - Timestamp
  - Empty state when no history

### Frontend API Calls
```typescript
api.getInventory(params?: { search?, lowStock? })
// Returns inventory items with product and location data

api.getLowStock()
// Returns products with quantity <= lowStockAlert

api.adjustStock(productId: string, data: {
  type: 'add' | 'remove',
  quantity: number,
  reason: string,
  notes?: string
})
```

### Backend Endpoints

**GET /api/v1/inventory**
- **Query Params:** `search?: string, lowStock?: boolean`
- **Response:** Array of Inventory objects with product and category
- **Features:**
  - Filters by product name, SKU, or barcode
  - Includes rackLocation and shelfLocation from Inventory table

**GET /api/v1/inventory/low-stock**
- **Response:** Array of products with low stock
- **Features:** Used for header notification badge

**PATCH /api/v1/inventory/:productId/adjust**
- **Request Body:** `{ type: string, quantity: number, reason?: string, notes?: string }`
- **Response:** Updated Inventory object
- **Features:**
  - Creates or updates inventory record
  - Creates InventoryLog entry
  - Sets lastRestockedAt for add operations

**GET /api/v1/inventory/logs**
- **Query Params:** `productId?: string, limit?: number` (default 50)
- **Response:** Array of InventoryLog objects
- **Features:**
  - Returns adjustment history
  - Ordered by createdAt descending
  - Includes product and user info

### Stock Adjustment Flow
1. User clicks adjust button on inventory row
2. Modal opens showing current stock
3. User selects Add/Remove
4. User enters quantity
5. User selects reason from dropdown
6. User optionally adds notes
7. User clicks Confirm
8. Backend:
   - Calculates new quantity
   - Updates inventory record
   - Creates inventory log entry
9. Frontend shows success toast, refreshes table

---

## 7. Reports Page

**File:** `frontend/src/app/(dashboard)/reports/page.tsx`

### Overview
Comprehensive reporting and analytics page with financial metrics, sales trends, and inventory insights.

### Frontend Features
- **Period Selector:** Last 7 Days, Last 30 Days, This Quarter, Custom date
- **KPI Cards:**
  - Total Revenue (with order count)
  - Gross Profit (with margin %)
  - Net Margin (after taxes)
  - Avg Order Value
- **Additional Stats Row:**
  - Total Products (count)
  - Low Stock Items (count)
  - Total Tax Collected
- **Revenue Trend Chart:**
  - Bar chart with daily revenue
  - Hover tooltip showing exact value
  - Best day highlighted
  - Y-axis labels formatted as currency
- **Financial Summary Panel:**
  - Gross Revenue
  - Discounts Given (negative, red)
  - Tax Collected
  - Net Revenue (highlighted)
  - Cost Estimate (~40% of revenue)
  - Estimated Profit (highlighted)

### Frontend API Calls
```typescript
api.getDashboard()
// Returns: { revenue, profit, orders, products }

api.getSalesTrend(days: number)
// Returns: [{ date, revenue }]
```

### Backend Endpoints

**GET /api/v1/reports/dashboard**
- **See Dashboard section above**

**GET /api/v1/reports/sales-trend**
- **See Dashboard section above**

### Financial Calculations
- **Gross Revenue:** Sum of all sale totals
- **Net Revenue:** Gross Revenue - Tax - Discounts
- **Cost Estimate:** Gross Revenue × 0.4 (assumes 40% cost ratio)
- **Estimated Profit:** Net Revenue - Cost Estimate
- **Net Margin %:** (Estimated Profit / Net Revenue) × 100

---

## 8. Suppliers Page

**File:** `frontend/src/app/(dashboard)/suppliers/page.tsx`

### Overview
Manages supplier profiles, purchase orders, and delivery tracking for inventory replenishment.

### Frontend Features
- Search functionality
- Supplier cards with contact info
- Purchase order management
- Delivery tracking status

### Frontend API Calls
```typescript
api.getSuppliers(search?: string)
// Returns supplier list

api.getPurchaseOrders(params?: { supplierId?, status? })
// Returns purchase orders

api.createPurchaseOrder(data: any)
// Creates new PO

api.receivePurchaseOrder(id: string, data: { receivedItems: any[] })
// Marks PO as received, updates inventory
```

### Backend Endpoints

**GET /api/v1/suppliers**
- **Query Params:** `search?: string`
- **Response:** Array of Supplier objects

**POST /api/v1/suppliers/purchase-orders**
- **Request Body:** Purchase order data with items
- **Response:** Created PurchaseOrder

**PATCH /api/v1/suppliers/purchase-orders/:id/receive**
- **Request Body:** `{ receivedItems: Array<{ productId, receivedQty }> }`
- **Response:** Updated PurchaseOrder
- **Features:**
  - Updates received quantity on items
  - Creates inventory records for received goods
  - Marks PO as received when complete

---

## 9. Users Page

**File:** `frontend/src/app/(dashboard)/users/page.tsx`

### Overview
Employee management page for user CRUD operations and role assignment.

### Frontend Features
- User list display
- Add/Edit user functionality
- Role assignment (Manager, Cashier, Inventory Staff, Owner)

### Frontend API Calls
```typescript
api.getUsers()
// Returns user list

api.createUser(data: { email, password, name, phone, roleId })
// Creates new user

api.updateUser(id: string, data: any)
// Updates existing user
```

### Backend Endpoints

**GET /api/v1/users**
- **Response:** Array of User objects with roles

**POST /api/v1/users**
- **Request Body:** `{ email, password, name, phone, roleIds }`
- **Response:** Created User

**PATCH /api/v1/users/:id**
- **Request Body:** Partial user object
- **Response:** Updated User

### Role System
- **Owner:** Full system access
- **Manager:** Operational access (inventory, products, reports)
- **Cashier:** POS access (sales, products read)
- **Inventory Staff:** Inventory access (stock updates)

---

## 10. Settings Page

**File:** `frontend/src/app/(dashboard)/settings/page.tsx`

### Overview
Store configuration and system settings management.

### Frontend Features
- Store information editing
- Business settings configuration

### Frontend API Calls
```typescript
api.getStoreInfo()
// Returns store details

api.updateStore(data: {
  name: string,
  address?: string,
  phone?: string,
  email?: string,
  gstNumber?: string,
  timezone?: string,
  currency?: string
})
// Updates store info
```

### Backend Endpoints

**GET /api/v1/settings/store**
- **Response:** Store object

**PATCH /api/v1/settings/store**
- **Request Body:** Partial store object
- **Response:** Updated Store

---

## Header Component (Global)

**File:** `frontend/src/components/Header.tsx`

### Features
- Navigation links (Overview, Live Feed, Store Analytics)
- Global search bar
- **Low Stock Alerts Bell Icon:**
  - Shows red badge with low stock count
  - Click opens notification dropdown
  - Lists up to 5 low stock items
  - Shows product name, SKU, quantity, alert threshold
  - "View all" link to inventory page

### Frontend API Calls
```typescript
api.getLowStock()
// Returns low stock items for notification badge
```

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "role-id",
  "storeId": "store-id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
All backend endpoints under `/api/v1/` (except auth) require valid JWT token in Authorization header.

### Audit Logging
The following actions are logged to `audit_logs` table:
- **LOGIN:** User login (metadata: email, timestamp, userAgent)
- **LOGOUT:** User logout (metadata: timestamp)
- **REGISTER:** User registration (metadata: email, timestamp)

---

## Database Schema Key Tables

| Table | Purpose |
|-------|---------|
| users | User accounts with hashed passwords |
| roles | Role definitions (owner, manager, cashier, inventory) |
| user_roles | User-role mappings |
| sessions | JWT session tracking |
| audit_logs | Authentication audit trail |
| stores | Multi-store support |
| user_stores | User-store assignments |
| products | Product catalog |
| categories | Product categories |
| inventory | Stock levels with rack/shelf location |
| inventory_logs | Stock adjustment history |
| sales | Sale transactions |
| sale_items | Individual items in sales |
| suppliers | Supplier profiles |
| purchase_orders | Purchase orders to suppliers |

---

## Common API Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

### Pagination Response (Products, etc.)
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```