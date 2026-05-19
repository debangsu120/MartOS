# Backend Product Requirements Document (PRD)
# MartOS Backend - Industry-Ready Retail Management Platform

---

# 1. Executive Summary

## 1.1 Purpose
This document outlines the backend requirements for MartOS, a cloud-native retail operating system. The backend will be built using NestJS, Prisma ORM, PostgreSQL, and Redis to deliver a scalable, secure, and high-performance API-first architecture.

## 1.2 Scope
The backend encompasses all server-side logic including:
- RESTful API endpoints
- Authentication & Authorization
- Database management
- Caching strategies
- Real-time WebSocket events
- File storage integration

## 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | NestJS 10+ | Node.js server framework |
| ORM | Prisma 5+ | Database abstraction & migrations |
| Database | PostgreSQL 15+ | Primary data store |
| Cache | Redis 7+ | Session & query caching |
| Auth | JWT + Refresh Tokens | Stateless authentication |
| API Docs | Swagger/OpenAPI | API documentation |
| Container | Docker | Application containerization |
| CI/CD | GitHub Actions | Automated deployment |

---

# 2. System Architecture

## 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│   │  Web App │  │  Mobile  │  │   POS    │  │  Admin   │       │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└────────┼─────────────┼─────────────┼─────────────┼──────────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                        │
│              (Load Balancing, SSL Termination)                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                       │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │   Auth      │  │   Users     │  │  Products   │            │
│   │   Module    │  │   Module    │  │   Module    │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │ Inventory   │  │   Sales     │  │ Suppliers   │            │
│   │   Module    │  │   Module    │  │   Module    │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │  Reports    │  │ Notifs      │  │  Settings   │            │
│   │   Module    │  │   Module    │  │   Module    │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                    │                    │
         ┌──────────┴──────────┐  ┌──────┴────────┐
         ▼                     ▼  ▼               ▼
┌─────────────────┐    ┌─────────────────┐  ┌─────────────┐
│   PostgreSQL    │    │     Redis       │  │   Storage   │
│   (Primary DB)  │    │    (Cache)      │  │   (S3/GCS)  │
└─────────────────┘    └─────────────────┘  └─────────────┘
```

## 2.2 Module Architecture

### 2.2.1 Core Modules
```
backend/
├── src/
│   ├── main.ts                    # Application entry
│   ├── app.module.ts               # Root module
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/             # Custom decorators (@User, @Roles)
│   │   ├── guards/                 # Auth guards (jwt, roles, permissions)
│   │   ├── filters/                # Exception filters
│   │   ├── interceptors/           # Response transformers
│   │   ├── pipes/                  # Validation pipes
│   │   └── constants/              # App constants
│   │
│   ├── config/                    # Configuration
│   │   ├── database.config.ts     # Prisma config
│   │   ├── redis.config.ts         # Redis config
│   │   └── app.config.ts           # Environment config
│   │
│   ├── modules/
│   │   ├── auth/                  # Authentication
│   │   │   ├── dto/               # Login, Register, Refresh DTOs
│   │   │   ├── strategies/        # JWT, Local strategies
│   │   │   ├── guards/            # Auth guards
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/                 # User Management
│   │   │   ├── dto/               # CRUD DTOs
│   │   │   ├── entities/          # User entity
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── stores/                # Multi-Store Management
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── stores.controller.ts
│   │   │   ├── stores.service.ts
│   │   │   └── stores.module.ts
│   │   │
│   │   ├── products/              # Product Management
│   │   │   ├── dto/               # Product CRUD DTOs
│   │   │   ├── entities/          # Product, Category entities
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── products.module.ts
│   │   │
│   │   ├── inventory/             # Inventory Management
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── inventory.module.ts
│   │   │
│   │   ├── sales/                 # POS & Sales
│   │   │   ├── dto/
│   │   │   ├── entities/           # Sale, SaleItem entities
│   │   │   ├── sales.controller.ts
│   │   │   ├── sales.service.ts
│   │   │   └── sales.module.ts
│   │   │
│   │   ├── suppliers/             # Supplier Management
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── suppliers.controller.ts
│   │   │   ├── suppliers.service.ts
│   │   │   └── suppliers.module.ts
│   │   │
│   │   ├── reports/              # Analytics & Reports
│   │   │   ├── dto/
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── reports.module.ts
│   │   │
│   │   ├── notifications/        # Notification System
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── notifications.module.ts
│   │   │
│   │   └── settings/            # Store Settings
│   │       ├── dto/
│   │       ├── entities/
│   │       ├── settings.controller.ts
│   │       ├── settings.service.ts
│   │       └── settings.module.ts
│   │
│   └── database/                 # Database configuration
│       ├── prisma/
│       │   ├── schema.prisma      # Database schema
│       │   └── migrations/        # Prisma migrations
│       └── seeders/              # Database seeders
```

---

# 3. Database Schema

## 3.1 Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │────<│   user_roles    │>────│     roles       │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │ (1:N)
         ▼
┌─────────────────┐     ┌─────────────────┐
│     stores      │     │  user_stores    │     (Many-to-Many)
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ (1:N)                  │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   categories    │<────│   products       │>────│   product_images │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                  │
                                  │ (1:N)
                                  ▼
┌─────────────────┐     ┌─────────────────┐
│   inventory     │     │  inventory_logs │
└────────┬────────┘     └─────────────────┘
         │
         │ (1:N)
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      sales      │<────│    sale_items   │>────│    products     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│  payment_details│
└─────────────────┘
```

## 3.2 Database Tables

### 3.2.1 Core Tables

```prisma
// schema.prisma

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  phone         String?
  avatar        String?
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  roles         UserRole[]
  stores        UserStore[]
  sales         Sale[]
  activities    AuditLog[]

  @@map("users")
}

model Role {
  id          String    @id @default(uuid())
  name        String    @unique // owner, manager, cashier, inventory
  description String?
  permissions Json      // Array of permission strings
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  users       UserRole[]

  @@map("roles")
}

model UserRole {
  userId    String
  roleId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  token        String   @unique
  refreshToken String   @unique
  expiresAt    DateTime
  deviceInfo   String?
  ipAddress    String?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ==========================================
// MULTI-STORE SUPPORT
// ==========================================

model Store {
  id              String    @id @default(uuid())
  name            String
  slug            String    @unique
  logo            String?
  address         String?
  phone           String?
  email           String?
  gstNumber       String?
  taxNumber       String?
  isActive        Boolean   @default(true)
  timezone        String    @default("Asia/Kolkata")
  currency        String    @default("INR")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  users           UserStore[]
  categories     Category[]
  products       Product[]
  inventory      Inventory[]
  sales          Sale[]
  suppliers      Supplier[]
  purchaseOrders PurchaseOrder[]
  settings       StoreSetting[]
  notifications  Notification[]

  @@map("stores")
}

model UserStore {
  userId    String
  storeId   String
  isDefault Boolean @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@id([userId, storeId])
  @@map("user_stores")
}

// ==========================================
// PRODUCTS & CATEGORIES
// ==========================================

model Category {
  id          String    @id @default(uuid())
  storeId     String
  name        String
  slug        String
  description String?
  parentId    String?
  image       String?
  displayOrder Int     @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  store       Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]

  @@unique([storeId, slug])
  @@map("categories")
}

model Product {
  id            String    @id @default(uuid())
  storeId       String
  categoryId    String?
  
  name          String
  slug          String
  sku           String    @unique
  barcode       String?
  description   String?
  
  costPrice     Decimal   @db.Decimal(10, 2)
  sellingPrice  Decimal   @db.Decimal(10, 2)
  mrp           Decimal?  @db.Decimal(10, 2)
  gstRate       Decimal   @default(0) @db.Decimal(5, 2)
  
  unit          String    @default("pcs") // pcs, kg, L, g, m
  weight        Decimal?  @db.Decimal(10, 3)
  
  isPerishable  Boolean   @default(false)
  expiryDays    Int?
  
  lowStockAlert Int       @default(10)
  reorderPoint  Int?
  
  isActive      Boolean   @default(true)
  isFeatured    Boolean   @default(false)
  
  imageUrl      String?
  images        Json?     // Array of image URLs
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  store         Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  category      Category? @relation(fields: [categoryId], references: [id])
  inventory     Inventory[]
  saleItems     SaleItem[]
  productSupplier ProductSupplier[]

  @@unique([storeId, sku])
  @@unique([storeId, barcode])
  @@map("products")
}

model ProductImage {
  id        String   @id @default(uuid())
  productId String
  url       String
  isPrimary Boolean  @default(false)
  order     Int      @default(0)

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductSupplier {
  id          String   @id @default(uuid())
  productId   String
  supplierId  String
  
  costPrice   Decimal  @db.Decimal(10, 2)
  minOrderQty Int?
  leadTimeDays Int?
  isPrimary   Boolean  @default(false)

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  supplier    Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@unique([productId, supplierId])
  @@map("product_suppliers")
}

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================

model Inventory {
  id          String    @id @default(uuid())
  storeId     String
  productId   String
  
  quantity    Int       @default(0)
  reservedQty Int       @default(0) // Quantity reserved in orders
  
  rackLocation String?
  shelfLocation String?
  
  batchNumber  String?
  expiryDate   DateTime?
  
  lastRestockedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  store       Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  logs        InventoryLog[]

  @@unique([storeId, productId])
  @@map("inventory")
}

model InventoryLog {
  id          String    @id @default(uuid())
  inventoryId String
  productId   String
  storeId     String
  userId      String
  
  type        String    // stock_in, stock_out, adjustment, sale, return
  quantity    Int       // Positive or negative
  reference   String?   // PO number, Sale ID, etc.
  reason      String?
  notes       String?
  
  createdAt   DateTime  @default(now())

  inventory   Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  
  @@map("inventory_logs")
}

// ==========================================
// SALES & POS
// ==========================================

model Sale {
  id            String    @id @default(uuid())
  storeId       String
  userId        String    // Cashier
  customerId    String?
  
  orderNumber   String    @unique
  invoiceNumber String?
  
  subtotal      Decimal   @db.Decimal(12, 2)
  discountAmount Decimal  @db.Decimal(12, 2)
  discountPercent Decimal? @db.Decimal(5, 2)
  taxAmount     Decimal   @db.Decimal(12, 2)
  totalAmount   Decimal   @db.Decimal(12, 2)
  
  paymentMethod String    // cash, card, upi, wallet
  paymentStatus String    @default("completed") // pending, completed, failed, refunded
  paymentRef    String?   // Transaction ID, UPI ref
  
  status        String    @default("completed") // pending, completed, cancelled, refunded
  
  notes         String?
  
  createdAt     DateTime  @default(now())
  completedAt   DateTime?

  store         Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id])
  customer      Customer? @relation(fields: [customerId], references: [id])
  items         SaleItem[]
  
  @@index([storeId, createdAt])
  @@index([userId, createdAt])
  @@map("sales")
}

model SaleItem {
  id          String   @id @default(uuid())
  saleId      String
  productId   String
  
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  costPrice   Decimal  @db.Decimal(10, 2) @default(0)
  discountPercent Decimal? @db.Decimal(5, 2)
  discountAmount Decimal @db.Decimal(10, 2) @default(0)
  taxPercent  Decimal  @db.Decimal(5, 2) @default(0)
  taxAmount   Decimal  @db.Decimal(10, 2) @default(0)
  totalAmount Decimal  @db.Decimal(12, 2)
  
  createdAt   DateTime @default(now())

  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])

  @@map("sale_items")
}

model Customer {
  id          String    @id @default(uuid())
  storeId     String
  
  name        String
  email       String?
  phone       String?
  
  totalOrders Int       @default(0)
  totalSpent Decimal   @default(0) @db.Decimal(12, 2)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  store       Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  sales       Sale[]

  @@unique([storeId, phone])
  @@map("customers")
}

// ==========================================
// SUPPLIERS & PURCHASE ORDERS
// ==========================================

model Supplier {
  id            String    @id @default(uuid())
  storeId       String
  
  name          String
  contactPerson String?
  email         String?
  phone         String?
  address       String?
  gstNumber     String?
  
  paymentTerms  String?   // Net 30, Net 45, etc.
  notes         String?
  
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  store         Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  products      ProductSupplier[]
  purchaseOrders PurchaseOrder[]
  
  @@map("suppliers")
}

model PurchaseOrder {
  id              String    @id @default(uuid())
  storeId         String
  supplierId     String
  userId          String    // Created by
  
  orderNumber    String    @unique
  status          String    @default("draft") // draft, sent, partial, received, cancelled
  
  expectedDate   DateTime?
  receivedDate   DateTime?
  
  itemsTotal     Decimal   @db.Decimal(12, 2) @default(0)
  taxAmount      Decimal   @db.Decimal(12, 2) @default(0)
  discountAmount Decimal   @db.Decimal(12, 2) @default(0)
  totalAmount    Decimal   @db.Decimal(12, 2) @default(0)
  
  notes           String?
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  store          Store          @relation(fields: [storeId], references: [id], onDelete: Cascade)
  supplier       Supplier       @relation(fields: [supplierId], references: [id])
  user           User           @relation(fields: [userId], references: [id])
  items          PurchaseOrderItem[]
  
  @@map("purchase_orders")
}

model PurchaseOrderItem {
  id              String   @id @default(uuid())
  purchaseOrderId String
  productId       String
  
  quantity        Int
  receivedQty     Int      @default(0)
  unitPrice       Decimal  @db.Decimal(10, 2)
  taxPercent     Decimal  @db.Decimal(5, 2) @default(0)
  totalAmount    Decimal  @db.Decimal(12, 2)
  
  createdAt       DateTime @default(now())

  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product         Product        @relation(fields: [productId], references: [id])

  @@map("purchase_order_items")
}

// ==========================================
// NOTIFICATIONS
// ==========================================

model Notification {
  id          String    @id @default(uuid())
  storeId     String
  userId      String?
  
  type        String    // low_stock, expiry, order, payment, system
  title       String
  message     String
  
  isRead      Boolean   @default(false)
  readAt      DateTime?
  
  actionUrl   String?
  actionLabel String?
  
  createdAt   DateTime  @default(now())

  store       Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead])
  @@map("notifications")
}

// ==========================================
// SETTINGS & CONFIGURATION
// ==========================================

model StoreSetting {
  id        String   @id @default(uuid())
  storeId   String
  key       String
  value     Json
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@unique([storeId, key])
  @@map("store_settings")
}

// ==========================================
// AUDIT & LOGGING
// ==========================================

model AuditLog {
  id          String    @id @default(uuid())
  userId      String?
  storeId     String?
  
  action      String    // create, update, delete, login, logout
  entity      String    // user, product, sale, etc.
  entityId    String
  
  changes     Json?     // Previous values
  metadata    Json?     // Additional info (IP, device, etc.)
  
  createdAt   DateTime  @default(now())

  user        User?     @relation(fields: [userId], references: [id])
  store       Store?    @relation(fields: [storeId], references: [id])
  
  @@index([userId, createdAt])
  @@index([storeId, createdAt])
  @@map("audit_logs")
}
```

---

# 4. API Endpoints

## 4.1 API Versioning
- Base URL: `/api/v1`
- All endpoints return JSON responses
- Date format: ISO 8601 (e.g., `2024-01-15T10:30:00Z`)

## 4.2 Authentication APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | User logout | Auth |
| GET | `/auth/me` | Get current user | Auth |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |

### Login Request
```json
POST /api/v1/auth/login
{
  "email": "manager@boutiquemart.com",
  "password": "securePassword123"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "manager@boutiquemart.com",
      "name": "Store Manager",
      "role": "manager",
      "stores": ["store-uuid"]
    }
  }
}
```

## 4.3 User Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users | Owner, Manager |
| GET | `/users/:id` | Get user details | Owner, Manager |
| POST | `/users` | Create new user | Owner |
| PATCH | `/users/:id` | Update user | Owner |
| DELETE | `/users/:id` | Deactivate user | Owner |
| GET | `/users/:id/permissions` | Get user permissions | Owner |
| PATCH | `/users/:id/permissions` | Update user permissions | Owner |

## 4.4 Store Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stores` | List stores (multi-tenant) | Owner |
| GET | `/stores/:id` | Get store details | All |
| POST | `/stores` | Create new store | Owner |
| PATCH | `/stores/:id` | Update store | Owner |
| DELETE | `/stores/:id` | Deactivate store | Owner |
| GET | `/stores/:id/stats` | Get store statistics | Manager |

## 4.5 Product Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/products` | List products (paginated) | All |
| GET | `/products/:id` | Get product details | All |
| POST | `/products` | Create product | Manager, Inventory |
| PATCH | `/products/:id` | Update product | Manager, Inventory |
| DELETE | `/products/:id` | Delete product | Manager |
| GET | `/products/barcode/:code` | Search by barcode | All |
| POST | `/products/import` | Bulk import products | Manager |
| GET | `/products/export` | Export products | Manager |
| GET | `/products/:id/history` | Product transaction history | Manager |

### Product List Query Parameters
```
GET /api/v1/products?page=1&limit=20&search=chana&category=snacks
&status=active&sort=createdAt&order=desc
```

## 4.6 Category Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/categories` | List categories | All |
| GET | `/categories/:id` | Get category with products | All |
| POST | `/categories` | Create category | Manager |
| PATCH | `/categories/:id` | Update category | Manager |
| DELETE | `/categories/:id` | Delete category | Manager |
| PATCH | `/categories/reorder` | Reorder categories | Manager |

## 4.7 Inventory Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/inventory` | List inventory | All |
| GET | `/inventory/low-stock` | Get low stock items | Manager |
| GET | `/inventory/expiring` | Get expiring items | Manager |
| POST | `/inventory/adjust` | Adjust stock | Inventory, Manager |
| POST | `/inventory/bulk-adjust` | Bulk stock adjustment | Manager |
| GET | `/inventory/history/:productId` | Stock history | Manager |
| POST | `/inventory/transfer` | Transfer between stores | Owner |

### Stock Adjustment Request
```json
POST /api/v1/inventory/adjust
{
  "productId": "uuid",
  "type": "stock_in", // stock_in, stock_out, adjustment
  "quantity": 50,
  "reason": "Purchase order received",
  "reference": "PO-2024-001",
  "notes": "Received from Green Valley Distributors"
}
```

## 4.8 POS & Sales APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/sales` | Create new sale | Cashier |
| GET | `/sales` | List sales | Manager |
| GET | `/sales/:id` | Get sale details | All |
| POST | `/sales/:id/refund` | Process refund | Manager |
| POST | `/sales/:id/void` | Void sale | Manager |
| GET | `/sales/current-order` | Get current POS order | Cashier |
| POST | `/sales/:id/hold` | Hold order | Cashier |
| POST | `/sales/recall/:orderId` | Recall held order | Cashier |

### Create Sale Request
```json
POST /api/v1/sales
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "discountPercent": 0
    },
    {
      "productId": "uuid",
      "quantity": 1,
      "discountPercent": 5
    }
  ],
  "paymentMethod": "upi",
  "customerId": "uuid (optional)",
  "notes": "Delivery requested"
}
```

### Sale Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2024-0001",
    "invoiceNumber": "INV-2024-0001",
    "items": [...],
    "subtotal": 530.00,
    "discountAmount": 26.50,
    "taxAmount": 25.18,
    "totalAmount": 528.68,
    "paymentMethod": "upi",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 4.9 Supplier Management APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/suppliers` | List suppliers | Manager |
| GET | `/suppliers/:id` | Get supplier details | Manager |
| POST | `/suppliers` | Create supplier | Manager |
| PATCH | `/suppliers/:id` | Update supplier | Manager |
| DELETE | `/suppliers/:id` | Deactivate supplier | Manager |

### Purchase Order APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/suppliers/:id/orders` | List purchase orders | Manager |
| POST | `/suppliers/:id/orders` | Create purchase order | Manager |
| GET | `/purchase-orders/:id` | Get PO details | Manager |
| PATCH | `/purchase-orders/:id` | Update PO | Manager |
| POST | `/purchase-orders/:id/receive` | Receive goods | Inventory |
| POST | `/purchase-orders/:id/cancel` | Cancel PO | Manager |

## 4.10 Reports & Analytics APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/dashboard` | Dashboard metrics | Manager |
| GET | `/reports/sales` | Sales reports | Manager |
| GET | `/reports/inventory` | Inventory reports | Manager |
| GET | `/reports/profit` | Profit reports | Owner |
| GET | `/reports/employees` | Employee performance | Owner |
| GET | `/reports/suppliers` | Supplier reports | Manager |
| GET | `/reports/customers` | Customer analytics | Manager |

### Dashboard Metrics Response
```json
{
  "success": true,
  "data": {
    "todaySales": {
      "amount": 45230,
      "orders": 142,
      "change": 12.5
    },
    "weekSales": { ... },
    "monthSales": { ... },
    "lowStockCount": 18,
    "pendingOrders": 5,
    "topProducts": [...],
    "topCategories": [...],
    "salesByPaymentMethod": {
      "cash": 35,
      "upi": 45,
      "card": 15,
      "wallet": 5
    }
  }
}
```

## 4.11 Notification APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | List notifications | Auth |
| PATCH | `/notifications/:id/read` | Mark as read | Auth |
| PATCH | `/notifications/read-all` | Mark all as read | Auth |
| DELETE | `/notifications/:id` | Delete notification | Auth |
| GET | `/notifications/unread-count` | Get unread count | Auth |

## 4.12 Settings APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings` | Get store settings | Manager |
| PATCH | `/settings` | Update store settings | Owner |
| GET | `/settings/taxes` | Get tax rates | All |
| POST | `/settings/taxes` | Add tax rate | Owner |
| GET | `/settings/invoice` | Get invoice settings | Manager |
| PATCH | `/settings/invoice` | Update invoice settings | Owner |

---

# 5. Authentication & Authorization

## 5.1 Authentication Flow

### 5.1.1 Login Flow
```
1. User enters email/password
2. Server validates credentials
3. If valid, generate JWT access token (15 min) + refresh token (7 days)
4. Store refresh token in httpOnly cookie + Redis
5. Return access token in response
6. Client stores access token in memory (not localStorage)
```

### 5.1.2 Token Refresh Flow
```
1. Access token expires (15 min)
2. Client sends refresh token to /auth/refresh
3. Server validates refresh token (DB + Redis)
4. If valid, generate new access + refresh tokens
5. Return new tokens
6. If invalid, return 401 - client redirects to login
```

### 5.1.3 Auto-Logout
```
1. Access token expires
2. No refresh token available
3. Clear client state
4. Redirect to login page
```

## 5.2 Role-Based Access Control (RBAC)

### 5.2.1 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Owner** | Full system access, manage billing, view all reports, manage users, configure settings |
| **Manager** | Manage inventory, view reports, manage products, process refunds, manage suppliers |
| **Cashier** | POS access, process sales, view own sales, product search |
| **Inventory** | Update stock, manage products, view inventory reports |

### 5.2.2 Permission Matrix

| Feature | Owner | Manager | Cashier | Inventory |
|---------|-------|---------|---------|------------|
| Dashboard | ✓ | ✓ | ✓ | Limited |
| POS Billing | ✓ | ✓ | ✓ | ✗ |
| Inventory View | ✓ | ✓ | ✗ | ✓ |
| Inventory Adjust | ✓ | ✓ | ✗ | ✓ |
| Product CRUD | ✓ | ✓ | ✗ | ✓ |
| Supplier Management | ✓ | ✓ | ✗ | ✗ |
| Reports | ✓ | ✓ | Limited | ✗ |
| User Management | ✓ | ✗ | ✗ | ✗ |
| Store Settings | ✓ | ✗ | ✗ | ✗ |
| Billing Refund | ✓ | ✓ | ✗ | ✗ |

## 5.3 Security Measures

| Feature | Implementation |
|---------|---------------|
| Password Storage | bcrypt with salt (12 rounds) |
| JWT | HS256 algorithm, short expiry |
| Rate Limiting | 100 requests/minute per IP |
| CORS | Whitelist allowed origins |
| XSS Protection | Input sanitization, output encoding |
| SQL Injection | Prisma ORM (parameterized queries) |
| CSRF | Double-submit cookie pattern |
| HTTPS | Enforced in production |
| Audit Logs | All CRUD operations logged |

---

# 6. Caching Strategy

## 6.1 Redis Cache Implementation

| Data | TTL | Invalidation |
|------|-----|--------------|
| User sessions | 7 days | On logout |
| Product list | 5 min | On product update |
| Category list | 1 hour | On category change |
| Dashboard stats | 1 min | On new sale |
| Low stock items | 5 min | On inventory update |
| Tax rates | 24 hours | On settings change |

## 6.2 Cache Keys Pattern

```
martos:{entity}:{id}          # Single item
martos:{entity}:list:{hash}  # List with filters
martos:user:{id}:session     # User session
martos:store:{id}:settings   # Store settings
```

---

# 7. Real-Time Features (WebSocket)

## 7.1 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `sale:created` | Server → Client | New sale notification |
| `inventory:updated` | Server → Client | Stock level change |
| `lowstock:alert` | Server → Client | Low stock warning |
| `order:status` | Server → Client | Order status update |

## 7.2 WebSocket Module
```typescript
// Gateway: EventsGateway
@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('join-store')
  handleJoinStore(client, storeId: string) {
    client.join(`store:${storeId}`);
  }

  emitSaleCreated(storeId: string, sale: Sale) {
    this.server.to(`store:${storeId}`).emit('sale:created', sale);
  }

  emitLowStockAlert(storeId: string, product: Product) {
    this.server.to(`store:${storeId}`).emit('lowstock:alert', product);
  }
}
```

---

# 8. File Upload & Storage

## 8.1 Supported File Types
- Images: JPG, PNG, WebP (max 5MB)
- Documents: PDF (max 10MB)
- CSV: Import files (max 2MB)

## 8.2 Storage Structure
```
martos-{env}/
├── products/
│   └── {store-id}/
│       └── {product-id}/
│           ├── original.jpg
│           └── thumbnail.jpg
├── invoices/
│   └── {store-id}/
│       └── {year}/
│           └── {month}/
│               └── {invoice-number}.pdf
└── imports/
    └── {store-id}/
        └── {timestamp}/
            └── import.csv
```

---

# 9. Third-Party Integrations

## 9.1 Payment Gateway (Future)
- Razorpay / Stripe / PayU
- UPI QR Code generation
- Payment webhook handling

## 9.2 SMS/Email Notifications (Future)
- Twilio for SMS
- SendGrid for emails
- Transactional notifications

## 9.3 Accounting Software (Future)
- QuickBooks integration
- Tally export

---

# 10. Performance Requirements

## 10.1 API Response Times

| Endpoint Type | Target | Maximum |
|--------------|--------|---------|
| Authentication | 100ms | 500ms |
| Product Search | 200ms | 500ms |
| POS Transaction | 300ms | 1s |
| Dashboard Load | 500ms | 2s |
| Report Generation | 2s | 10s |

## 10.2 Throughput
- Support 100+ concurrent users
- Handle 1000+ POS transactions per hour
- Process bulk imports up to 10,000 products

## 10.3 Database Optimization
- Indexes on frequently queried columns
- Query pagination for large datasets
- Connection pooling (100 connections)
- Read replicas for reporting

---

# 11. Error Handling

## 11.1 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 11.2 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

---

# 12. API Documentation

## 12.1 Swagger/OpenAPI
- Auto-generated from NestJS decorators
- Available at `/api/docs`
- Includes:
  - Request/Response schemas
  - Authentication requirements
  - Example values
  - Response codes

## 12.2 Postman Collection
- Exportable collection for testing
- Environment variables support
- Pre-configured authentication

---

# 13. Testing Strategy

## 13.1 Unit Tests
- Service layer methods
- Utility functions
- DTO validation
- Target: 80% code coverage

## 13.2 Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

## 13.3 E2E Tests
- Complete user flows
- POS transaction flow
- Report generation

---

# 14. Deployment

## 14.1 Docker Configuration

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### Docker Compose (Development)
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/martos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=martos
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

## 14.2 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 3000 |
| `DATABASE_URL` | PostgreSQL connection | - |
| `REDIS_URL` | Redis connection | - |
| `JWT_SECRET` | JWT signing key | - |
| `JWT_REFRESH_SECRET` | Refresh token key | - |
| `UPLOAD_DIR` | File upload directory | /tmp/uploads |
| `CORS_ORIGIN` | Allowed origins | * |

## 14.3 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t martos-api:${{ github.sha }} .
```

---

# 15. Development Roadmap

## Phase 1: Foundation (Week 1-2)
- [ ] Project setup with NestJS
- [ ] Prisma schema design
- [ ] Authentication module
- [ ] User management
- [ ] Basic CRUD for stores

## Phase 2: Core Features (Week 3-4)
- [ ] Product management
- [ ] Category management
- [ ] Inventory tracking
- [ ] Stock adjustment logs

## Phase 3: Sales Module (Week 5-6)
- [ ] POS endpoints
- [ ] Sale creation
- [ ] Payment processing
- [ ] Invoice generation

## Phase 4: Advanced (Week 7-8)
- [ ] Supplier management
- [ ] Purchase orders
- [ ] Reports generation
- [ ] Dashboard metrics

## Phase 5: Polish (Week 9-10)
- [ ] WebSocket notifications
- [ ] Caching implementation
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Docker & deployment

---

# 16. Monitoring & Logging

## 16.1 Logging
- Structured JSON logs
- Log levels: error, warn, info, debug
- Request/response logging
- Error stack traces

## 16.2 Monitoring
- Health check endpoint: `/health`
- CPU, Memory, Response time metrics
- Integration with DataDog/New Relic (optional)

## 16.3 Alerting
- Failed login attempts
- Low stock thresholds
- API error rates
- Database connection issues

---

# 17. Glossary

| Term | Definition |
|------|------------|
| JWT | JSON Web Token for stateless auth |
| RBAC | Role-Based Access Control |
| ORM | Object-Relational Mapping |
| Prisma | Type-safe ORM for Node.js |
| WebSocket | Real-time bidirectional communication |
| SKU | Stock Keeping Unit |
| GST | Goods and Services Tax (India) |
| PO | Purchase Order |
| TTL | Time To Live (cache expiry) |

---

# 18. Appendix

## A.1 API Response Conventions
- All responses wrapped in `{ success, data, error }`
- Pagination: `{ page, limit, total, items }`
- Dates in ISO 8601 format
- Decimal amounts with 2 decimal places

## A.2 Rate Limiting
- 100 requests/minute per IP
- 1000 requests/hour per user
- Exceeded requests return 429

## A.3 Versioning Strategy
- URL-based: `/api/v1/`
- Major version changes for breaking changes
- Minor version changes for new features

---

*Document Version: 1.0*
*Last Updated: May 2026*
*Author: Backend Team*