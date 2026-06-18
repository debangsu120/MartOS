# MartOS - Modern Retail Management Information System

## Project Documentation for Academic Presentation

---

## Table of Contents
1. [Introduction to MartOS](#1-introduction-to-martos)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Feature Walkthrough](#5-feature-walkthrough)
6. [API Documentation](#6-api-documentation)
7. [Database Schema](#7-database-schema)
8. [Why MartOS is a Good Solution](#8-why-martos-is-a-good-solution)
9. [Security & Authentication](#9-security--authentication)

---

## 1. Introduction to MartOS

### What is MartOS?

MartOS (Mart Operating System) is a comprehensive **Point of Sale (POS) and Retail Management Information System** designed specifically for boutique organic retail stores. It serves as a centralized platform to manage all aspects of retail operations, from inventory tracking to sales analytics.

### Why Was It Built?

Boutique organic retail stores face unique challenges:
- Managing diverse product catalogs with expiry date tracking
- Tracking inventory across multiple storage locations (racks, shelves)
- Maintaining accurate stock levels for perishable goods
- Managing multiple employee roles with different access levels
- Generating reports for business decision-making

Traditional spreadsheet-based or manual systems fail to address these needs efficiently. MartOS provides a **unified, real-time solution** that streamlines all retail operations.

### Key Problems MartOS Solves

| Problem | Solution in MartOS |
|---------|-------------------|
| Manual inventory tracking | Real-time digital inventory management with low stock alerts |
| Expiry date confusion | Perishable item tracking with expiry days field |
| Scattered product information | Centralized product catalog with rack/shelf mapping |
| Access control issues | Role-based authentication (Manager vs Cashier) |
| Sales reporting complexity | Automated dashboard with real-time analytics |
| Supplier management | Integrated supplier and purchase order system |

---

## 2. System Architecture

### Frontend (Next.js 14)
- **Framework:** Next.js with React
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Custom API client

### Backend (NestJS)
- **Framework:** NestJS (Node.js)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

### Communication Flow
```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐     Prisma/ORM     ┌──────────────┐
│   Frontend      │ ◄──────────────► │   Backend API   │ ◄──────────────► │  PostgreSQL  │
│   (Next.js)     │    JSON/JWT      │    (NestJS)    │                 │  Database    │
└─────────────────┘                  └─────────────────┘                  └──────────────┘
```

### Directory Structure
```
information_system_at_mart/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/       # Product management
│   │   │   ├── inventory/      # Inventory management
│   │   │   ├── sales/         # Sales/POS
│   │   │   ├── reports/       # Analytics & reports
│   │   │   ├── suppliers/     # Supplier management
│   │   │   ├── users/         # User management
│   │   │   └── settings/       # Store settings
│   │   ├── config/            # Prisma configuration
│   │   └── common/            # Guards, decorators
│   └── prisma/
│       ├── schema.prisma       # Database schema
│       └── seed.ts            # Sample data
│
└── frontend/                   # Next.js Frontend
    └── src/
        ├── app/               # Pages
        │   ├── (dashboard)/    # Protected dashboard pages
        │   │   ├── dashboard/  # Main dashboard
        │   │   ├── products/   # Product management
        │   │   ├── inventory/  # Inventory management
        │   │   ├── pos/       # Point of Sale
        │   │   ├── reports/   # Reports & analytics
        │   │   ├── sales/     # Transaction history
        │   │   ├── suppliers/  # Supplier management
        │   │   ├── users/     # User management
        │   │   └── settings/   # Store settings
        │   └── login/         # Login page
        ├── components/        # Reusable components
        ├── lib/               # API client, utilities
        └── store/             # Zustand state management
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React-based web application |
| **Styling** | Tailwind CSS | Custom responsive designs |
| **State** | Zustand | Lightweight state management |
| **Backend** | NestJS | Modular Node.js framework |
| **ORM** | Prisma | Type-safe database access |
| **Database** | PostgreSQL | Relational data storage |
| **Auth** | JWT + bcrypt | Secure authentication |

### Why These Technologies?

- **Next.js:** Server-side rendering, fast page loads, SEO friendly
- **NestJS:** TypeScript-first, modular architecture, dependency injection
- **Prisma:** Type safety, migrations, easy schema management
- **PostgreSQL:** ACID compliance, JSON support, scalability

---

## 4. User Roles & Permissions

MartOS implements **Role-Based Access Control (RBAC)** with two primary roles:

### Manager Role
Managers have **full access** to all features:
- ✅ View dashboard & analytics
- ✅ Add, edit, delete products
- ✅ Manage inventory & stock adjustments
- ✅ Assign rack/shelf locations
- ✅ View low stock alerts
- ✅ Manage categories & pricing
- ✅ Generate sales/profit reports
- ✅ View analytics & charts
- ✅ Manage workers/cashiers
- ✅ View transaction history
- ✅ Handle returns/refunds
- ✅ Supplier & purchase management

### Cashier/Worker Role
Cashiers have **limited access** for operational tasks:
- ✅ Login access
- ✅ Search products quickly
- ✅ View rack/shelf location
- ✅ Record sales transactions
- ✅ Generate bills/invoices
- ✅ Check stock availability
- ✅ Process customer payments
- ✅ View daily sales summary
- ✅ Print receipts
- ❌ Cannot add/edit products
- ❌ Cannot access reports/analytics
- ❌ Cannot manage users
- ❌ Cannot adjust inventory

### Why Role Separation?

1. **Security:** Prevents unauthorized actions
2. **Accountability:** Each action can be traced to a user
3. **Efficiency:** Cashiers can focus on sales without distraction
4. **Data Protection:** Sensitive reports only accessible to managers

---

## 5. Feature Walkthrough

### 5.1 Login Page (`/login`)

**Purpose:** Authenticate users and provide secure access to the system.

**Features:**
- Email/password authentication
- Password visibility toggle
- Remember me functionality
- JWT token-based session management
- Responsive design (mobile-friendly)

**Backend Endpoint:**
```
POST /api/v1/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }
```

**User Flow:**
1. User enters credentials
2. Backend validates against bcrypt-hashed password
3. Returns JWT token and user info (including role)
4. Frontend stores token in localStorage
5. Subsequent requests include `Authorization: Bearer <token>`

---

### 5.2 Dashboard (`/dashboard`)

**Purpose:** Provide real-time overview of store performance.

**Features:**
- **KPI Cards (Key Performance Indicators):**
  - Today's Sales (with % change from previous period)
  - Total Orders count
  - Low Stock Items count (clickable link to inventory)
  - Average Profit Margin percentage

- **Revenue Trends Chart:**
  - Bar chart showing last 7 days revenue
  - Hover tooltips showing exact values
  - Best-performing day highlighted

- **Quick Actions Panel:**
  - New POS Sale → Opens POS terminal
  - Receive Stock → Opens inventory management
  - Add Product → Opens product creation form

- **Top Performers Section:**
  - List of top 5 selling products
  - Shows product name, stock, revenue generated

- **Inventory Alerts Table:**
  - Products with low stock
  - Critical/Low status badges
  - Reorder button

**Dashboard API Response:**
```json
{
  "revenue": { "total": 60963.40, "tax": 5375.75, "discount": 1432.35 },
  "profit": { "amount": 17897.65, "margin": 29.36 },
  "orders": { "total": 60, "averageValue": 1016.06 },
  "products": { "total": 40, "lowStock": 1 }
}
```

**Why This Dashboard Matters:**
- Managers can quickly assess store health
- Identify underperforming products
- Spot inventory issues before they become problems
- Make data-driven decisions

---

### 5.3 Products Page (`/products`)

**Purpose:** Manage the product catalog.

**Features:**
- **Product Grid View:**
  - Product cards with image, name, SKU
  - Stock status badges (In Stock/Low Stock/Out of Stock)
  - **Rack/Shelf location display** (e.g., "📍 A-1 / Top")
  - Selling price and current quantity

- **Search & Filter:**
  - Search by product name or SKU
  - Filter by category
  - Filter by stock status

- **Product Management:**
  - Add new products (Manager only)
  - Edit existing products (Manager only)
  - View product details

**Backend Endpoints:**
```
GET    /api/v1/products          - List all products
GET    /api/v1/products/:id       - Get single product
POST   /api/v1/products           - Create product (Manager)
PATCH  /api/v1/products/:id       - Update product (Manager)
DELETE /api/v1/products/:id       - Soft delete product (Manager)
GET    /api/v1/products/categories - List categories
```

**Rack/Shelf Mapping Feature:**
- Each product can have a rack location (e.g., "A-1", "B-2")
- Each product can have a shelf location (e.g., "Top", "Middle", "Bottom")
- Displayed on product cards for easy stock retrieval
- Helps staff quickly locate products in the store

---

### 5.4 Add Product Page (`/products/add`)

**Purpose:** Create new products with detailed information.

**Form Fields:**
| Field | Description | Required |
|-------|-------------|----------|
| Product Name | Name of the product | Yes |
| Category | Product category from dropdown | No |
| SKU Code | Unique stock keeping unit | Yes |
| Barcode | Product barcode (optional) | No |
| Description | Product description | No |
| Selling Price | Retail price | Yes |
| Cost Price | Wholesale/purchase price | Yes |
| GST Rate | Tax rate (0%, 5%, 12%, 18%, 28%) | Yes |
| Low Stock Alert | Minimum quantity before alert | Yes |
| Unit | pieces, kg, g, l, ml, box, pack | Yes |
| **Rack Location** | Storage rack identifier | No |
| **Shelf Location** | Shelf position | No |
| **Perishable Item** | Toggle for expiry tracking | No |
| **Expiry Days** | Days until expiry (if perishable) | No |

**Backend Flow:**
1. Validate all required fields
2. Generate slug from product name
3. Create product in database
4. Automatically create inventory record with:
   - Initial stock (default 0)
   - Rack location
   - Shelf location

**API Call:**
```
POST /api/v1/products
Body: { name, sku, sellingPrice, costPrice, gstRate, rackLocation, shelfLocation, isPerishable, expiryDays, ... }
```

---

### 5.5 Point of Sale (`/pos`)

**Purpose:** Process customer sales transactions.

**Features:**

1. **Product Discovery Panel:**
   - Search bar (searches by name, SKU, barcode)
   - Category filter pills
   - Product grid with quick-add buttons

2. **Shopping Cart:**
   - Real-time cart updates
   - Quantity adjustment (+/-)
   - Remove items
   - Clear cart option

3. **Billing Summary:**
   - Subtotal calculation
   - Discount (10% configurable)
   - GST calculation (5% or product-specific)
   - **Total amount**

4. **Payment Methods:**
   - Cash
   - Card
   - UPI (Unified Payments Interface)
   - Wallet

5. **Digital Receipt:**
   - Appears after successful sale
   - Shows order number, items, totals
   - Payment method indicator
   - Print button
   - Can be saved for records

**Sale Flow:**
```
1. Scan/Search Products → Add to Cart
2. Select Payment Method
3. Click "Pay" → API creates sale
4. Backend:
   - Validates stock availability
   - Calculates totals with GST
   - Decreases inventory quantities
   - Creates sale record with items
5. Receipt modal appears
6. Customer receives printed/digital receipt
```

**Backend Endpoints:**
```
POST /api/v1/sales           - Create new sale
GET  /api/v1/sales            - List sales
GET  /api/v1/sales/:id        - Get sale details
PATCH /api/v1/sales/:id/void  - Void/refund sale
```

---

### 5.6 Inventory Page (`/inventory`)

**Purpose:** Manage stock levels and track inventory movements.

**Features:**

1. **Stats Dashboard:**
   - Total Inventory Value (quantity × price)
   - Low Stock Items count
   - Recent Stock Movement chart

2. **Stock Adjustment Modal:**
   - Add Stock / Remove Stock toggle
   - Quantity input
   - Reason dropdown:
     - Restock / New Delivery
     - Sale / Transaction
     - Customer Return
     - Damaged / Expired
     - Stock Correction
     - Transfer In/Out
   - Notes field for additional context

3. **Stock History Log:**
   - All past adjustments listed
   - Shows: Date, Product, Type (Add/Remove), Quantity, Reason, Notes

4. **Inventory Table:**
   - Product name, SKU
   - **Rack/Shelf Location** (from product assignment)
   - Current quantity with visual progress bar
   - Stock status badges
   - Quick adjustment button

**Backend Endpoints:**
```
GET  /api/v1/inventory              - List all inventory
GET  /api/v1/inventory/low-stock    - Products with low stock
GET  /api/v1/inventory/logs          - Adjustment history
PATCH /api/v1/inventory/:productId/adjust - Adjust stock
```

**Why Stock Management Matters:**
- Prevents stockouts (lost sales)
- Prevents overstocking (capital tied up)
- Reduces wastage (especially for perishables)
- Enables just-in-time reordering

---

### 5.7 Reports Page (`/reports`)

**Purpose:** Generate business insights through analytics.

**Features:**

1. **Period Selector:**
   - Last 7 Days
   - Last 30 Days
   - This Quarter
   - Custom date range

2. **KPI Cards:**
   - Total Revenue
   - Gross Profit
   - Net Margin (after taxes)
   - Average Order Value

3. **Revenue Trend Chart:**
   - Bar chart visualization
   - Daily revenue breakdown
   - Hover tooltips with exact values
   - Best day highlighting

4. **Financial Summary Panel:**
   - Gross Revenue
   - Less: Discounts Given
   - Less: Tax Collected
   - = Net Revenue
   - Less: Estimated Cost (~40% of revenue)
   - = Estimated Profit

5. **Additional Metrics:**
   - Total Products in catalog
   - Low Stock Items count
   - Total Tax Collected

**Backend Endpoints:**
```
GET /api/v1/reports/dashboard        - Main dashboard metrics
GET /api/v1/reports/sales-trend       - Daily revenue trend
GET /api/v1/reports/top-products      - Best selling products
GET /api/v1/reports/categories        - Sales by category
GET /api/v1/reports/hourly            - Hourly sales breakdown
GET /api/v1/reports/inventory-value   - Inventory valuation
```

**Report Generation Logic:**
```javascript
// Revenue = Sum of all completed sale totals
// Profit = Revenue - Tax - (Revenue × 0.4)  // assuming 40% cost
// Margin = (Profit / Revenue) × 100
```

**Why Reports Matter:**
- Track business performance over time
- Identify seasonal trends
- Make informed purchasing decisions
- Monitor product profitability

---

### 5.8 Sales/Transactions Page (`/sales`)

**Purpose:** View complete transaction history.

**Features:**
- Search by order number or customer
- Filter by period (Today, Last 7 Days, Last 30 Days, All Time)
- Filter by status (Completed, Pending, Void/Refunded)
- Transaction table with:
  - Order number
  - Date & time
  - Customer name
  - Items count
  - Payment method
  - Total amount
  - Status badge
- View full receipt details
- Reprint receipts

**Export Feature:**
- CSV export of transactions
- Useful for accounting/external analysis

---

### 5.9 Suppliers Page (`/suppliers`)

**Purpose:** Manage supplier relationships and purchase orders.

**Features:**
- Supplier profiles (name, contact, email, address)
- Purchase order creation
- Order status tracking (Pending, Shipped, Received)
- Receive inventory from purchase orders
- Automatic inventory update on receipt

**Backend Endpoints:**
```
GET  /api/v1/suppliers                  - List suppliers
POST /api/v1/suppliers                  - Create supplier
GET  /api/v1/suppliers/:id              - Get supplier details
PATCH /api/v1/suppliers/:id             - Update supplier
DELETE /api/v1/suppliers/:id            - Delete supplier
GET  /api/v1/suppliers/purchase-orders   - List POs
POST /api/v1/suppliers/purchase-orders  - Create PO
PATCH /api/v1/suppliers/purchase-orders/:id/receive - Mark PO received
```

**Purchase Order Flow:**
```
1. Create PO with items and quantities
2. Send to supplier
3. When goods arrive → Mark PO as received
4. System automatically increases inventory
5. Purchase cost recorded for reporting
```

---

### 5.10 Users Page (`/users`)

**Purpose:** Manage employee accounts and roles.

**Features:**
- User list with role badges
- Add new user modal
- Edit existing user
- Activate/Deactivate users
- Role assignment (Manager, Cashier, Inventory Staff)

**Role Badges:**
- 🟢 Manager (dark green)
- 🔵 Cashier (medium green)
- ⚪ Inventory Staff (gray)

**Backend Endpoints:**
```
GET    /api/v1/users      - List users
POST   /api/v1/users      - Create user
GET    /api/v1/users/:id  - Get user details
PATCH  /api/v1/users/:id  - Update user
DELETE /api/v1/users/:id  - Deactivate user
GET    /api/v1/users/roles - List available roles
```

---

### 5.11 Settings Page (`/settings`)

**Purpose:** Configure store information and system settings.

**Features:**
- Store name, address, contact
- Business registration details
- GST number
- Timezone settings
- Notification preferences

**Backend Endpoints:**
```
GET  /api/v1/settings/store     - Get store info
PATCH /api/v1/settings/store    - Update store info
```

---

### 5.12 Global Header Component

**Features:**
- Navigation links (Overview, Live Feed, Store Analytics)
- Global search bar
- **Low Stock Alerts Bell:**
  - Red badge with count
  - Dropdown showing low stock items
  - Quick link to inventory

**Notifications System:**
```
GET /api/v1/notifications              - List notifications
GET /api/v1/notifications/unread-count  - Get unread count
PATCH /api/v1/notifications/:id/read   - Mark as read
PATCH /api/v1/notifications/read-all   - Mark all as read
```

---

## 6. API Documentation

### Authentication Flow

```javascript
// Frontend Login Request
POST /api/v1/auth/login
{
  "email": "manager@boutiquemart.com",
  "password": "password123"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni...",
  "expiresIn": 3600,
  "user": {
    "id": "17acafff-9c41-422c-9410-841bd1854792",
    "email": "manager@boutiquemart.com",
    "name": "Arjun K.",
    "role": "manager",  // or "cashier"
    "stores": ["4145e8d1-db61-4d35-a379-9e76ea553296"]
  }
}
```

### JWT Token Structure

The JWT payload contains:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "role-id",
  "storeId": "store-uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Complete API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| **Auth** ||||
| POST | /api/v1/auth/login | User login | Public |
| POST | /api/v1/auth/register | User registration | Public |
| POST | /api/v1/auth/refresh | Refresh token | Public |
| POST | /api/v1/auth/logout | User logout | Auth |
| **Products** ||||
| GET | /api/v1/products | List products | Auth |
| GET | /api/v1/products/:id | Get product | Auth |
| POST | /api/v1/products | Create product | Manager |
| PATCH | /api/v1/products/:id | Update product | Manager |
| DELETE | /api/v1/products/:id | Delete product | Manager |
| GET | /api/v1/products/categories | List categories | Auth |
| **Inventory** ||||
| GET | /api/v1/inventory | List inventory | Auth |
| GET | /api/v1/inventory/low-stock | Low stock items | Auth |
| GET | /api/v1/inventory/logs | Adjustment history | Auth |
| PATCH | /api/v1/inventory/:productId/adjust | Adjust stock | Manager |
| **Sales** ||||
| GET | /api/v1/sales | List sales | Auth |
| POST | /api/v1/sales | Create sale | Auth |
| GET | /api/v1/sales/:id | Get sale | Auth |
| PATCH | /api/v1/sales/:id/void | Void sale | Manager |
| **Reports** ||||
| GET | /api/v1/reports/dashboard | Dashboard metrics | Auth |
| GET | /api/v1/reports/sales-trend | Sales trend | Auth |
| GET | /api/v1/reports/top-products | Top products | Auth |
| GET | /api/v1/reports/categories | Sales by category | Auth |
| **Suppliers** ||||
| GET | /api/v1/suppliers | List suppliers | Auth |
| POST | /api/v1/suppliers | Create supplier | Manager |
| GET | /api/v1/suppliers/purchase-orders | List POs | Auth |
| POST | /api/v1/suppliers/purchase-orders | Create PO | Manager |
| PATCH | /api/v1/suppliers/purchase-orders/:id/receive | Receive PO | Manager |
| **Users** ||||
| GET | /api/v1/users | List users | Manager |
| POST | /api/v1/users | Create user | Manager |
| PATCH | /api/v1/users/:id | Update user | Manager |
| GET | /api/v1/users/roles | List roles | Manager |

---

## 7. Database Schema

### Core Entities

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ password (hash) │
│ name            │
│ phone           │
│ isActive        │
│ lastLoginAt     │
│ createdAt       │
└────────┬────────┘
         │
         │ UserRole (many-to-many)
         │
┌────────▼────────┐     ┌─────────────────┐
│     Role        │     │     Store       │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ name            │     │ name            │
│ (owner/manager/ │     │ address         │
│  cashier/       │     │ phone           │
│  inventory)      │     │ gstNumber       │
└─────────────────┘     └────────┬────────┘
                                │
                     UserStore (many-to-many)
                                │
                     ┌──────────▼──────────┐
                     │    Product          │
                     ├─────────────────────┤
                     │ id (PK)             │
                     │ storeId (FK)        │
                     │ categoryId (FK)     │
                     │ name, sku, barcode │
                     │ sellingPrice        │
                     │ costPrice, mrp      │
                     │ gstRate, unit       │
                     │ isPerishable         │
                     │ expiryDays          │
                     │ lowStockAlert       │
                     └──────────┬──────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
     ┌────────▼────────┐ ┌─────▼───────┐ ┌──────▼───────┐
     │   Inventory      │ │  SaleItem   │ │SaleOrderItem │
     ├─────────────────┤ └─────────────┘ └──────────────┘
     │ storeId (FK)    │
     │ productId (FK)   │
     │ quantity         │
     │ rackLocation     │
     │ shelfLocation    │
     └─────────────────┘
```

### Key Relationships

- **User ↔ Role:** Many-to-many through UserRole
- **User ↔ Store:** Many-to-many through UserStore
- **Store → Products:** One-to-many
- **Product → Inventory:** One-to-one
- **Sale → SaleItem:** One-to-many

---

## 8. Why MartOS is a Good Solution

### 8.1 For Boutique Retailers

| Challenge | MartOS Solution |
|-----------|-----------------|
| **Manual tracking** | Digital inventory with real-time updates |
| **Expiry confusion** | Perishable item tracking with expiry days |
| **Product location** | Rack/shelf mapping for quick retrieval |
| **Report generation** | Automated dashboards and analytics |
| **Multi-user access** | Role-based permissions |
| **Supplier management** | Integrated PO system |
| **Audit trail** | Activity logging for accountability |

### 8.2 Technical Advantages

1. **Scalability**
   - PostgreSQL handles large datasets
   - NestJS modular architecture allows easy expansion
   - API-based design enables mobile app integration

2. **Security**
   - JWT authentication with refresh tokens
   - bcrypt password hashing
   - Role-based access control
   - Audit logging for compliance

3. **Maintainability**
   - TypeScript for type safety
   - Prisma ORM for clean database operations
   - Component-based frontend architecture
   - Clear separation of concerns

4. **User Experience**
   - Responsive design (works on mobile/tablet)
   - Fast page loads with Next.js
   - Intuitive POS interface
   - Real-time notifications

### 8.3 Cost Effectiveness

| Aspect | Traditional System | MartOS |
|--------|-------------------|--------|
| Paper records | High cost | None |
| Manual calculations | Error-prone | Automated |
| Report generation | Time-consuming | Instant |
| Multi-store support | Difficult | Built-in |
| Data backup | Manual | Automated |

### 8.4 Real-World Impact

**Before MartOS:**
- 2 hours daily for inventory counting
- Weekly manual sales reports
- Lost sales due to stockouts
- Product location confusion

**After MartOS:**
- Real-time inventory visibility
- Instant dashboard analytics
- Low stock alerts prevent stockouts
- Rack/shelf mapping speeds up retrieval

---

## 9. Security & Authentication

### Authentication Flow

```
┌────────┐                    ┌─────────┐                    ┌──────────┐
│ Client │                    │  API    │                    │ Database │
└───┬────┘                    └────┬────┘                    └────┬─────┘
    │                              │                              │
    │ 1. POST /auth/login         │                              │
    │    {email, password}         │                              │
    │─────────────────────────────►│                              │
    │                              │ 2. Find user by email        │
    │                              │─────────────────────────────►│
    │                              │                              │
    │                              │ 3. Compare bcrypt hash       │
    │                              │◄─────────────────────────────│
    │                              │                              │
    │                              │ 4. Generate JWT              │
    │                              │                              │
    │ 5. {accessToken, user}      │                              │
    │◄─────────────────────────────│                              │
    │                              │                              │
    │ 6. GET /products             │                              │
    │    Authorization: Bearer     │                              │
    │─────────────────────────────►│                              │
    │                              │ 7. Verify JWT               │
    │                              │                              │
    │                              │ 8. Fetch products            │
    │                              │─────────────────────────────►│
    │                              │                              │
    │                              │ 9. Return products          │
    │                              │◄─────────────────────────────│
    │ 10. Products data            │                              │
    │◄─────────────────────────────│                              │
```

### Password Security

- Passwords hashed with **bcrypt** (12 rounds)
- Never stored in plain text
- Salt automatically generated

### JWT Token Security

- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (7 days)
- Tokens invalidated on logout
- Store ID embedded in token for multi-tenancy

### Audit Logging

All significant actions are logged:
- User login/logout
- Product creation/modification
- Stock adjustments
- Sale transactions
- User management

---

## 10. Conclusion

MartOS represents a **modern, comprehensive solution** for boutique retail management. Built with industry-standard technologies, it provides:

- **Efficiency:** Automated processes save time
- **Accuracy:** Real-time data prevents errors
- **Visibility:** Dashboards provide instant insights
- **Security:** Robust authentication and authorization
- **Scalability:** Architecture supports growth

The system successfully addresses the unique challenges of organic retail businesses while providing a foundation for future expansion (mobile apps, cloud backup, AI forecasting).

---

## Appendix: Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Manager | manager@boutiquemart.com | password123 |
| Cashier | cashier@boutiquemart.com | password123 |

---

*Documentation prepared for academic presentation*
*MartOS v1.0 - Modern Retail Management Information System*