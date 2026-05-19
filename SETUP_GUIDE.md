# MartOS Setup Guide

## Prerequisites

1. **Node.js** v18+ installed
2. **PostgreSQL** v14+ installed
3. **npm** or **yarn**

---

## Step 1: Database Setup

### Install PostgreSQL (if not installed)
- Download from https://www.postgresql.org/download/
- During installation, set password for `postgres` user
- Default port: `5432`

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE martos;

# Exit
\q
```

---

## Step 2: Backend Setup

### Navigate to backend directory
```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Create environment file
```bash
# Create .env file
copy .env.example .env
```

### Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/martos?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
```

### Run database migrations
```bash
npx prisma migrate dev --name init
```

### (Optional) Seed initial data
```bash
npx prisma db seed
```

### Start backend server
```bash
# Development mode (with hot reload)
npm run start:dev

# OR production mode
npm run build
npm run start:prod
```

Backend will run at: **http://localhost:3001**
- API Docs (Swagger): **http://localhost:3001/api**

---

## Step 3: Frontend Setup

### Navigate to frontend directory
```bash
cd frontend
```

### Install dependencies
```bash
npm install
```

### Create environment file (if needed)
```bash
# Already created with NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Start frontend
```bash
# Development mode
npm run dev

# OR production build
npm run build
npm run start
```

Frontend will run at: **http://localhost:3000**

---

## Step 4: Test the Application

### Login Credentials (from seed data)
| Role | Email | Password |
|------|-------|----------|
| Manager | manager@boutiquemart.com | password123 |
| Cashier | cashier@boutiquemart.com | password123 |

### Test API Endpoints
```bash
# Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@boutiquemart.com","password":"password123"}'

# Get products (after getting token)
curl -X GET http://localhost:3001/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Available API Endpoints

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/refresh` - Refresh token

### Products
- `GET /products` - List products
- `GET /products/categories` - List categories
- `POST /products` - Create product
- `GET /products/:id` - Get product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Inventory
- `GET /inventory` - List inventory
- `GET /inventory/summary` - Stock summary
- `GET /inventory/low-stock` - Low stock items
- `PATCH /inventory/:productId/adjust` - Adjust stock

### Sales
- `POST /sales` - Create sale (POS)
- `GET /sales` - List sales
- `GET /sales/daily` - Daily sales
- `PATCH /sales/:id/void` - Void sale

### Reports
- `GET /reports/dashboard` - Dashboard metrics
- `GET /reports/sales-trend` - Sales trend
- `GET /reports/top-products` - Top products
- `GET /reports/categories` - Category sales

### Suppliers
- `GET /suppliers` - List suppliers
- `POST /suppliers` - Create supplier
- `GET /suppliers/purchase-orders` - List POs
- `POST /suppliers/purchase-orders` - Create PO

### Settings
- `GET /settings` - Get all settings
- `GET /settings/store` - Store info
- `PATCH /settings/store` - Update store

---

## Project Structure

```
martos/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── products/   # Products & categories
│   │   │   ├── inventory/  # Stock management
│   │   │   ├── sales/     # POS & transactions
│   │   │   ├── suppliers/ # Suppliers & POs
│   │   │   ├── reports/   # Analytics
│   │   │   └── ...
│   │   └── config/        # Database config
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
├── frontend/               # Next.js UI
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand state
│   │   └── lib/          # API client & data
│   └── package.json
│
└── SETUP_GUIDE.md         # This file
```

---

## Common Issues

### PostgreSQL Connection Failed
- Check if PostgreSQL service is running
- Verify username/password in `.env`
- Ensure database `martos` exists

### CORS Errors
- Backend runs on port 3001
- Frontend runs on port 3000
- Already configured in backend

### Token Issues
- JWT secret must be set in backend `.env`
- Token stored in localStorage after login
- Check browser console for errors

---

## Next Steps

1. **Seed more data** - Add sample products, categories
2. **Connect frontend** - Update components to use real API data
3. **Add real-time** - Implement WebSocket for notifications
4. **Deploy** - Set up production environment