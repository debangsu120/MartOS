# Frontend Product Requirements Document (PRD)
# MartOS Frontend - Industry-Ready Retail Management Platform

---

# 1. Introduction

## 1.1 Purpose

This document outlines the frontend requirements for MartOS, a cloud-native retail operating system. The frontend will be built using Next.js, Tailwind CSS, TypeScript, Zustand, and React Query to deliver a responsive, performant, and user-friendly experience across all devices.

## 1.2 Scope

The frontend encompasses all user-facing interfaces including authentication, POS terminal, inventory management, analytics dashboards, supplier management, and administrative controls.

## 1.3 Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14+ | Framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| React Query | Server state management |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Lucide React | Icons |
| Recharts | Charts/graphs |
| React Hot Toast | Notifications |
| date-fns | Date utilities |

---

# 2. User Roles & Permissions

## 2.1 Role Matrix

| Feature | Owner | Manager | Cashier | Inventory Staff |
|---------|-------|---------|---------|-----------------|
| Dashboard View | ✓ | ✓ | ✓ | Limited |
| POS Billing | ✓ | ✓ | ✓ | ✗ |
| Inventory Management | ✓ | ✓ | ✗ | ✓ |
| Product CRUD | ✓ | ✓ | ✗ | ✓ |
| Supplier Management | ✓ | ✓ | ✗ | ✗ |
| Analytics/Reports | ✓ | ✓ | Limited | ✗ |
| User Management | ✓ | ✗ | ✗ | ✗ |
| Store Settings | ✓ | ✗ | ✗ | ✗ |
| Audit Logs | ✓ | ✓ | ✗ | ✗ |

## 2.2 Navigation by Role

### Owner Navigation
- Dashboard
- POS Terminal
- Inventory
- Products
- Suppliers
- Reports
- Users
- Settings

### Manager Navigation
- Dashboard
- POS Terminal
- Inventory
- Products
- Suppliers
- Reports

### Cashier Navigation
- POS Terminal
- Product Search
- Today's Sales

### Inventory Staff Navigation
- Inventory
- Products
- Shelf Mapping

---

# 3. Page Structure & Architecture

## 3.1 App Routes

```
/                           → Landing/Login
/dashboard                  → Dashboard (role-based redirect)
/pos                        → POS Terminal
/inventory                  → Inventory List
/inventory/adjustments      → Stock Adjustments
/inventory/low-stock        → Low Stock Alerts
/products                   → Product Management
/products/add               → Add Product
/products/[id]              → Edit Product
/products/import            → Bulk Import
/categories                 → Category Management
/shelves                     → Shelf/Rack Mapping
/suppliers                  → Supplier List
/suppliers/[id]             → Supplier Details
/suppliers/orders           → Purchase Orders
/reports                    → Reports Center
/reports/sales              → Sales Reports
/reports/inventory          → Inventory Reports
/reports/profit             → Profit Reports
/users                      → User Management
/settings                   → Store Settings
```

## 3.2 Layout Components

### Main Layout
- **Sidebar**: Collapsible, 280px expanded / 80px collapsed
- **Header**: 64px height, user profile, notifications, store selector
- **Content Area**: Fluid width with max-width 1440px
- **Footer**: Optional, 48px for legal links

### POS Layout
- **Full-screen mode**: No sidebar/header
- **Touch-optimized**: Large touch targets (min 48px)
- **Split view**: Product grid (65%) + Cart (35%)

### Auth Layout
- Centered card layout
- Background pattern/image support

---

# 4. UI/UX Requirements

## 4.1 Design System

### Color Palette

#### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| primary | #0F766E (Teal 700) | Primary actions, links |
| primary-hover | #0D9488 (Teal 600) | Hover states |
| secondary | #6366F1 (Indigo 500) | Secondary actions |
| success | #16A34A (Green 600) | Success states, positive |
| warning | #D97706 (Amber 600) | Warnings, alerts |
| danger | #DC2626 (Red 600) | Errors, destructive |
| background | #F8FAFC (Slate 50) | Page background |
| surface | #FFFFFF | Cards, modals |
| border | #E2E8F0 (Slate 200) | Borders |
| text-primary | #0F172A (Slate 900) | Headings |
| text-secondary | #64748B (Slate 500) | Body text |
| text-muted | #94A3B8 (Slate 400) | Placeholders |

#### Dark Mode
| Token | Value | Usage |
|-------|-------|-------|
| primary | #2DD4BF (Teal 400) | Primary actions |
| background | #0F172A (Slate 900) | Page background |
| surface | #1E293B (Slate 800) | Cards |
| border | #334155 (Slate 700) | Borders |
| text-primary | #F1F5F9 (Slate 100) | Headings |
| text-secondary | #94A3B8 (Slate 400) | Body text |

### Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|--------------|
| H1 | Inter | 32px | 700 | 1.2 |
| H2 | Inter | 24px | 600 | 1.3 |
| H3 | Inter | 20px | 600 | 1.4 |
| H4 | Inter | 16px | 600 | 1.4 |
| Body | Inter | 14px | 400 | 1.5 |
| Small | Inter | 12px | 400 | 1.5 |
| Mono | JetBrains Mono | 13px | 400 | 1.6 |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Default spacing |
| lg | 24px | Section spacing |
| xl | 32px | Page margins |
| 2xl | 48px | Large gaps |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Inputs, small |
| md | 8px | Cards, buttons |
| lg | 12px | Modals |
| xl | 16px | Large containers |
| full | 9999px | Pills, avatars |

### Shadows

```css
/* Card shadow */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)
```

## 4.2 Component Specifications

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| Primary | primary | white | none | primary-hover |
| Secondary | transparent | secondary | 1px secondary | bg-secondary/10 |
| Ghost | transparent | text-primary | none | bg-slate-100 |
| Danger | danger | white | none | red-700 |
| Success | success | white | none | green-700 |

### Button Sizes
| Size | Height | Padding | Font |
|------|-------|---------|------|
| xs | 28px | px-2.5 py-1 | 12px |
| sm | 32px | px-3 py-1.5 | 13px |
| md | 40px | px-4 py-2 | 14px |
| lg | 48px | px-6 py-3 | 16px |

### Inputs

- Height: 40px (default), 48px (POS)
- Border: 1px solid border color
- Focus: 2px primary ring
- Error: danger border + error message
- Disabled: bg-slate-100, cursor-not-allowed

### Cards

- Background: surface color
- Border: 1px border color
- Border-radius: md (8px)
- Padding: lg (24px)
- Shadow: shadow-sm (hover: shadow-md)

### Tables

- Header: bg-slate-50, font-semibold
- Rows: hover:bg-slate-50
- Striped: alternate bg-slate-50/50
- Pagination: bottom right

### Modals

- Overlay: bg-black/50, backdrop-blur
- Container: max-width md, centered
- Animation: fade + scale
- Close: top-right X button

### Toast Notifications

- Position: bottom-right
- Duration: 5s default
- Types: success, error, warning, info
- Actions: optional undo button

---

# 5. Feature Specifications

## 5.1 Authentication Module

### Login Page (`/login`)
- Logo + brand name
- Email/username input
- Password input + show/hide toggle
- Remember me checkbox
- Forgot password link
- Login button (full width)
- Error handling with inline messages

### Forgot Password Flow
- Email input → Send reset link
- Reset link email
- New password + confirm password
- Success redirect to login

### Session Management
- JWT stored in httpOnly cookie (recommended)
- Access token in memory
- Refresh token rotation
- Auto logout on token expiry
- Keep-alive ping every 5 minutes

### Auth State
```
{
  user: {
    id: string,
    email: string,
    name: string,
    role: 'owner' | 'manager' | 'cashier' | 'inventory',
    storeId: string,
    avatar?: string
  },
  isAuthenticated: boolean,
  isLoading: boolean
}
```

---

## 5.2 Dashboard (`/dashboard`)

### Overview Cards (Top Row)
| Card | Metric | Icon | Color |
|------|--------|------|-------|
| Today's Sales | ₹XX,XXX | TrendingUp | success |
| Orders Today | XX | ShoppingCart | primary |
| Low Stock Items | XX | AlertTriangle | warning |
| Pending Orders | XX | Clock | secondary |

### Sales Chart (Main Area)
- Line/Bar chart showing last 7 days
- Toggle: Daily/Weekly/Monthly
- Tooltip with exact values
- Legend for multiple series

### Recent Transactions (Right Side)
- Last 10 transactions
- Columns: Time, Amount, Payment, Cashier
- Click to view receipt

### Quick Actions (Bottom)
- New Sale
- Add Product
- Stock Check
- Reports

### Role-Based Variations
- **Cashier**: Only shows their sales, simplified view
- **Inventory**: Shows inventory alerts, stock status

---

## 5.3 POS Terminal (`/pos`)

### Layout
```
┌─────────────────────────────────────────────┐
│  [Store Name]  │  Date  │  Time  │  User   │
├─────────────────────────────────────────────┤
│ ┌─────────────┐ │ ┌──────────────────────┐  │
│ │ Product     │ │ │ CART                 │  │
│ │ Search      │ │ │ ├─ Item 1  ₹XXX      │  │
│ │ [Scan/Type] │ │ │ │  - Qty: 2 [+/−]     │  │
│ ├─────────────┤ │ │ ├─ Item 2  ₹XXX      │  │
│ │ Category    │ │ │ │  - Qty: 1 [+/−]     │  │
│ │ Buttons     │ │ │ └──────────────────────┘  │
│ ├─────────────┤ │ │                      │  │
│ │ Product     │ │ │ Subtotal: ₹XXX        │  │
│ │ Grid        │ │ │ Discount: -₹XX       │  │
│ │             │ │ │ Tax (GST): ₹XX       │  │
│ │ [Tile]      │ │ │ ─────────────────────│  │
│ │ [Tile]      │ │ │ TOTAL: ₹XXX          │  │
│ │ [Tile]      │ │ │                      │  │
│ └─────────────┘ │ │ [CASH] [CARD] [UPI]  │  │
│                 │ │ [HOLD] [CLEAR]       │  │
│                 │ └──────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Product Search
- Auto-focus on load
- Debounced search (300ms)
- Search by: barcode, name, SKU
- Instant suggestions dropdown
- Keyboard navigation (arrows + enter)

### Product Grid
- Responsive: 4 cols desktop, 3 cols tablet, 2 cols mobile
- Product card: Image, name, price, quick-add
- Category filter tabs
- Favorites section

### Cart Operations
- Add/remove items
- Quantity adjustment (+/− buttons, direct input)
- Unit price display
- Line item subtotal
- Remove item button
- Clear cart button
- Hold order (save for later)

### Discount Handling
- Item-level discount (%)
- Cart-level discount (₹ or %)
- Applied discount indicator
- Discount reason input

### Tax Calculation
- Auto-calculate GST
- Tax breakup display
- Multiple tax rates support

### Payment Processing
- Payment method buttons: Cash, Card, UPI, Wallet
- Cash: Show change calculation
- Card/UPI: Show QR or enter transaction ID
- Split payment support
- Change calculation for cash

### Receipt Generation
- Auto-print option
- Digital receipt preview
- Receipt fields: Store, Items, Totals, Payment, QR code

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| F1 | Search focus |
| F2 | New customer |
| F3 | Apply discount |
| F4 | Select payment |
| F5 | Complete sale |
| F6 | Hold order |
| F7 | Clear cart |
| F8 | Last item undo |
| Esc | Cancel operation |

### Offline Mode
- Local storage for pending transactions
- Sync when online
- Offline indicator banner
- Queue management UI

---

## 5.4 Inventory Management (`/inventory`)

### Inventory List View
- Search/filter bar
- Columns: SKU, Product, Category, Rack, Qty, Cost, Status
- Sortable columns
- Pagination (20/50/100 per page)
- Bulk actions: Update qty, Export

### Stock Adjustment
- Adjustment form: Product, Type (add/remove/reason)
- Adjustment reason dropdown
- Quantity input (positive/negative)
- Notes field
- Audit trail entry

### Low Stock Alerts
- Filterable list
- Threshold settings per product
- Alert cards with product details
- Quick reorder action

### Batch/Expiry Tracking
- Batch number filter
- Expiry date display
- Near-expiry warnings (30 days)
- Expired items highlight

### Inventory Reports
- Stock valuation
- Movement history
- Reorder suggestions
- Export to CSV

---

## 5.5 Product Management (`/products`)

### Product List
- Grid/List view toggle
- Search + filters
- Columns: Image, Name, SKU, Barcode, Category, Price, Stock
- Quick actions: Edit, View, Delete

### Add/Edit Product Form
```
┌──────────────────────────────┐
│ Basic Information            │
│ ├─ Name (required)          │
│ ├─ SKU (auto-generate)      │
│ ├─ Barcode (scan/manual)    │
│ ├─ Description              │
│ └─ Images (drag & drop)     │
├──────────────────────────────┤
│ Pricing                     │
│ ├─ Cost Price (required)    │
│ ├─ Selling Price (required) │
│ ├─ GST Rate (%)             │
│ └─ MRP                      │
├──────────────────────────────┤
│ Inventory                   │
│ ├─ Initial Quantity         │
│ ├─ Low Stock Alert          │
│ └─ Reorder Quantity         │
├──────────────────────────────┤
│ Location                    │
│ ├─ Rack Number              │
│ ├─ Shelf Position           │
│ └─ Category                 │
├──────────────────────────────┤
│ Additional                   │
│ ├─ Batch Number             │
│ ├─ Expiry Date              │
│ └─ Unit (pcs/kg/L)           │
└──────────────────────────────┘
```

### Bulk Import
- CSV template download
- Drag & drop upload
- Preview grid with error highlighting
- Column mapping
- Import progress
- Error report download

### Barcode Generation
- Auto-generate from SKU
- Manual entry
- Print label option
- Support: Code128, EAN-13

---

## 5.6 Category Management (`/categories`)

### Category List
- Tree view with subcategories
- Drag & drop reordering
- Columns: Name, Products, Actions

### Category Form
- Name
- Parent category (optional)
- Image/icon
- Display order

---

## 5.7 Shelf/Rack Mapping (`/shelves`)

### Visual Rack Map
- Grid visualization of store layout
- Drag & drop product placement
- Rack/Shelf labels
- Color-coded by category

### Rack Management
- Add/Edit racks
- Assign shelves
- Product count per rack

---

## 5.8 Supplier Management (`/suppliers`)

### Supplier List
- Search + filters
- Columns: Name, Contact, Products, Orders, Balance
- Quick actions: Call, Email, View

### Supplier Details
```
┌─────────────────────────────────────┐
│ Supplier Profile                    │
│ ├─ Company Name                     │
│ ├─ Contact Person                   │
│ ├─ Phone, Email, Address            │
│ ├─ Tax Details (GST)                │
│ ├─ Payment Terms                   │
│ ├─ Notes                           │
├─────────────────────────────────────┤
│ Product Supply (linked products)   │
├─────────────────────────────────────┤
│ Order History                      │
│ ├─ PO List                          │
│ ├─ Delivery Status                 │
│ ├─ Payment History                  │
└─────────────────────────────────────┘
```

### Purchase Order
- Create PO from supplier
- Add products, quantities, price
- Expected delivery date
- Status tracking (Draft, Sent, Received, Cancelled)
- Receive goods flow

---

## 5.9 Reports & Analytics (`/reports`)

### Sales Reports
- Date range picker
- Filter by: Cashier, Payment method, Category
- Charts: Daily sales trend, Top products, Top customers
- Table: Transaction list
- Export: PDF, Excel, CSV

### Inventory Reports
- Stock valuation
- Fast/Slow movers
- Dead stock
- Category-wise breakdown

### Profit Reports
- Gross profit margin
- By product/category/period
- Trend analysis
- Comparison (period vs period)

### Employee Performance
- Sales by cashier
- Transactions count
- Average basket size
- Returns/voids

### Report Builder (Advanced)
- Custom date ranges
- Custom fields selection
- Saved report templates
- Scheduled exports

---

## 5.10 User Management (`/users` - Owner Only)

### User List
- All users with role
- Active/Inactive status
- Last login

### Add/Edit User
- Name, Email, Phone
- Role assignment
- Password (auto-generate option)
- Store assignment (multi-store)

### Permissions Matrix
- Granular permission toggles
- Permission groups

---

## 5.11 Settings (`/settings` - Owner Only)

### Store Profile
- Store name, logo
- Address, phone, email
- GST details
- Business type

### Tax Settings
- Default GST rates
- Tax groups

### Invoice Settings
- Invoice prefix
- Auto-increment number
- Footer message

### Notification Preferences
- Email alerts
- In-app notifications
- SMS (future)

### Integrations
- Printer setup
- Barcode scanner
- Payment gateway (future)

### Backup & Security
- Manual backup trigger
- Activity logs
- Session management

---

# 6. Component Library

## 6.1 Core Components

### UI Components
| Component | Description | Props |
|-----------|-------------|-------|
| Button | Primary action button | variant, size, loading, icon |
| Input | Text input field | label, error, icon, type |
| Select | Dropdown select | options, searchable, multi |
| Checkbox | Toggle checkbox | label, indeterminate |
| Radio | Radio buttons | options, inline |
| Toggle | On/off switch | label, disabled |
| Modal | Dialog overlay | open, onClose, size, title |
| Drawer | Slide-out panel | open, side, title |
| Card | Content container | padding, shadow, bordered |
| Table | Data table | columns, data, pagination |
| Tabs | Tab navigation | items, active |
| Badge | Status indicator | color, label, dot |
| Avatar | User image | src, size, fallback |
| Tooltip | Hover info | content, position |
| Skeleton | Loading placeholder | variant, animate |
| EmptyState | No data view | icon, title, action |

### Form Components
| Component | Description |
|-----------|-------------|
| Form | Wrapper with validation |
| FormField | Label + input + error |
| FormSelect | Select with form integration |
| FormDatePicker | Date picker |
| FormInput | Text input with form |
| FormTextarea | Text area |
| FormFile | File upload |
| FormSearch | Search input |

### Data Display
| Component | Description |
|-----------|-------------|
| DataTable | Sortable, filterable table |
| DataGrid | Card grid view |
| StatCard | Metric display |
| Chart | Recharts wrapper |
| Timeline | Event timeline |
| Tree | Hierarchical view |

### Feedback
| Component | Description |
|-----------|-------------|
| Toast | Notification popup |
| Alert | Inline alert message |
| Loading | Spinner/skeleton |
| Progress | Progress bar/circle |
| Confirm | Confirmation dialog |

---

## 7. State Management

## 7.1 Zustand Stores

### Auth Store
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

### UI Store
```typescript
interface UIStore {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme) => void;
  addNotification: (notification) => void;
}
```

### POS Store
```typescript
interface POSStore {
  cart: CartItem[];
  customer: Customer | null;
  holdOrders: Order[];
  addToCart: (product) => void;
  removeFromCart: (productId) => void;
  updateQuantity: (productId, qty) => void;
  applyDiscount: (discount) => void;
  clearCart: () => void;
  holdOrder: () => void;
  recallOrder: (orderId) => void;
}
```

### Inventory Store
```typescript
interface InventoryStore {
  products: Product[];
  filters: InventoryFilters;
  selectedProducts: string[];
  setFilters: (filters) => void;
  setProducts: (products) => void;
  bulkUpdate: (ids, data) => Promise<void>;
}
```

## 7.2 React Query Configuration

### Query Keys
```typescript
const queryKeys = {
  auth: ['auth', 'me'],
  products: ['products', filters],
  product: (id) => ['products', id],
  categories: ['categories'],
  inventory: ['inventory', filters],
  sales: ['sales', filters],
  reports: ['reports', type, filters],
  suppliers: ['suppliers'],
  users: ['users'],
};
```

### Default Options
```typescript
const defaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 30 * 60 * 1000, // 30 min
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
};
```

---

# 8. API Integration

## 8.1 API Client

### Axios Instance
```typescript
// Base configuration
baseURL: process.env.NEXT_PUBLIC_API_URL
timeout: 30000
headers: { Content-Type: 'application/json' }
```

### Interceptors
- Request: Add auth token
- Response: Handle 401 (refresh), errors

### Error Handling
- Network errors
- Validation errors (422)
- Auth errors (401, 403)
- Server errors (500)

## 8.2 API Service Modules

| Module | Endpoints |
|--------|------------|
| authService | login, logout, refresh, forgotPassword, resetPassword |
| productService | CRUD operations, search, import, export |
| inventoryService | stock levels, adjustments, transfers |
| salesService | create, list, receipts, reports |
| categoryService | CRUD, reorder |
| supplierService | CRUD, orders |
| userService | CRUD, permissions |
| analyticsService | dashboard, reports |
| settingsService | store, tax, invoice |

---

# 9. Performance Requirements

## 9.1 Load Times

| Page | Target | Max |
|------|--------|-----|
| Initial Load | 1.5s | 3s |
| Dashboard | 2s | 3s |
| POS Terminal | 1s | 2s |
| Product Search | 200ms | 500ms |
| Cart Operations | 100ms | 300ms |

## 9.2 Optimization Strategies

- Next.js App Router (Server Components)
- Image optimization (next/image)
- Code splitting by route
- Lazy load heavy components
- Virtual scrolling for large lists
- Debounced search inputs
- Optimistic updates
- Service worker for offline

---

# 10. Responsive Design

## 10.1 Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

## 10.2 Responsive Behavior

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Sidebar | Visible | Collapsible | Hidden |
| Navigation | Full | Hamburger | Bottom nav |
| POS Layout | Split (65/35) | Stacked | Full screen |
| Tables | Full columns | Scrollable | Card view |
| Forms | Multi-column | Single column | Single column |
| Charts | Full size | Reduced | Simplified |

---

# 11. Accessibility Requirements

## 11.1 WCAG 2.1 AA Compliance

- Color contrast ratio 4.5:1 minimum
- Keyboard navigation for all interactive elements
- Focus indicators visible
- Screen reader compatible (ARIA labels)
- Form labels associated with inputs
- Error messages announced
- Skip to main content link

## 11.2 Keyboard Navigation

- Tab order follows visual order
- Escape closes modals/drawers
- Arrow keys navigate menus
- Enter/Space activates buttons
- Shortcuts displayed in tooltips

---

# 12. Security Considerations

## 12.1 Frontend Security

- No sensitive data in localStorage (except tokens if httpOnly unavailable)
- Sanitize user inputs
- XSS prevention (React handles this)
- CSRF tokens
- Content Security Policy headers

## 12.2 Authentication Flow

- Redirect to login on 401
- Clear tokens on logout
- Session timeout (configurable)
- Remember device option

---

# 13. Development Standards

## 13.1 Code Organization

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   │   └── login/
│   ├── (dashboard)/       # Protected routes
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   └── ...
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing/redirect
├── components/
│   ├── ui/                # Base components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # Constants
├── store/                 # Zustand stores
├── services/              # API services
├── types/                 # TypeScript types
└── styles/               # Global styles
```

## 13.2 Naming Conventions

- Components: PascalCase (ProductCard)
- Hooks: camelCase with 'use' prefix (useProducts)
- Functions: camelCase (formatCurrency)
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case (product-card.tsx)

## 13.3 Component Structure

```typescript
// Component structure
export function ComponentName({ prop1, prop2 }) {
  // Hooks first
  // State
  // Effects
  // Handlers
  // Render
  
  return (
    <JSX>
  );
}
```

---

# 14. Testing Strategy

## 14.1 Testing Types

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Jest/Vitest | 70% |
| Integration | React Testing Library | 50% |
| E2E | Playwright | Critical flows |

## 14.2 Test Scenarios

- Authentication flow
- POS full transaction
- Product CRUD operations
- Inventory adjustments
- Report generation

---

# 15. Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

# 16. Milestones & Timeline

## Phase 1: Foundation (Week 1-2)
- Project setup
- Design system implementation
- Auth module
- Layout components
- Routing setup

## Phase 2: Core Features (Week 3-4)
- Dashboard
- Product management
- Category management

## Phase 3: POS Development (Week 5-6)
- POS terminal
- Cart functionality
- Payment processing
- Receipt generation

## Phase 4: Inventory & Reports (Week 7-8)
- Inventory management
- Stock adjustments
- Reports module
- Analytics

## Phase 5: Advanced Features (Week 9-10)
- Supplier management
- User management
- Settings
- Notifications

## Phase 6: Polish & Deploy (Week 11-12)
- Performance optimization
- Responsive testing
- Accessibility audit
- Bug fixes
- Production deployment

---

# 17. Dependencies & Packages

## Core Dependencies
```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "zustand": "4.x",
  "@tanstack/react-query": "5.x",
  "react-hook-form": "7.x",
  "zod": "3.x",
  "@hookform/resolvers": "3.x",
  "recharts": "2.x",
  "lucide-react": "latest",
  "react-hot-toast": "latest",
  "date-fns": "3.x",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

## Dev Dependencies
```json
{
  "eslint": "8.x",
  "prettier": "3.x",
  "@types/node": "20.x"
}
```

---

# 18. Glossary

| Term | Definition |
|------|------------|
| POS | Point of Sale - where transactions occur |
| SKU | Stock Keeping Unit - unique product identifier |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token for authentication |
| GST | Goods and Services Tax (India) |
| PWA | Progressive Web App |
| CSR | Client-Side Rendering |
| SSR | Server-Side Rendering |

---

# 19. Appendix

## 19.1 Mock Data Requirements
- Sample products (50+)
- Sample categories (10)
- Sample transactions (100)
- Sample users (5 per role)

## 19.2 Environment Variables
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_DEFAULT_CURRENCY=
```

## 19.3 Future Considerations (Phase 2)
- Multi-store support
- Mobile apps
- AI analytics
- Customer loyalty
- Payment integration

---

*Document Version: 1.0*
*Last Updated: May 2026*
*Author: Frontend Team*