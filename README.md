# ShopSphere — QE Demo E-Commerce Platform

A deliberately crafted demo e-commerce web application built as a test harness for an Agentic AI-powered Quality Engineering (QE) automation system.

## 🎯 Project Purpose

ShopSphere is a realistic, multi-layered web application designed to test automated quality engineering workflows including:
- UI testing
- API contract validation
- Link tree traversal
- Intentional bug detection

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + React Router v6
- **Backend**: Node.js + Express
- **Styling**: CSS Modules
- **Data**: In-memory JSON (no database required)

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Install all dependencies:
```bash
npm run install:all
```

### Running the Application

Start both frontend and backend servers:
```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Re-seed data
npm run seed
```

## 🧪 Test Credentials

### User Accounts (Seeded Data)
- **Email**: john.doe@example.com | **Password**: password123
- **Email**: jane.smith@example.com | **Password**: password123
- **Email**: bob.wilson@example.com | **Password**: password123

## 📁 Project Structure

```
/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # Route pages
│   │   ├── components/ # Reusable components
│   │   ├── context/   # React Context providers
│   │   ├── services/  # API service layer
│   │   └── utils/     # Helpers and utilities
│   └── package.json
│
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/    # API route handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── data/      # Seed data files
│   │   └── utils/     # Utilities
│   └── package.json
│
└── package.json       # Root workspace config
```

## 🐛 Intentional Bugs

This application contains **16 intentional bugs** (8 frontend, 8 backend) for QE testing purposes. These bugs are documented in the BRD and should NOT be fixed as they serve as test targets for the AI QE system.

### Frontend Bugs (BUG-F01 to BUG-F08)
- Price formatting errors
- Cart state issues
- Form validation gaps
- UI display bugs
- Broken links

### Backend/API Bugs (BUG-B01 to BUG-B08)
- Wrong HTTP status codes
- Missing validation
- Schema inconsistencies
- Auth bypass issues
- Silent failures

## 📋 API Documentation

Base URL: `http://localhost:5000/api`

### Endpoints

#### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Submit review (auth required)

#### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category details

#### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart quantity
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

#### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Place new order
- `GET /api/orders/:id/track` - Get tracking timeline

#### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (auth required)

#### Other
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:id` - Remove from wishlist
- `GET /api/search?q=` - Search products
- `POST /api/contact` - Submit contact form

## 🎨 Features

### Frontend Pages (18 Routes)
- Home, Product Listing, Product Detail, Category Pages
- Cart, Checkout, Order Confirmation
- Login, Register, User Profile
- Order History, Order Detail, Wishlist
- Search Results, About, Contact, FAQ
- 404 Error Page

### Components
- Navbar with search and cart
- Product cards with wishlist toggle
- Filter sidebar with multiple filters
- Pagination and sorting
- Multi-step checkout
- Order status tracking
- And many more...

## 🧪 Testability Features

All interactive elements include:
- `data-testid` attributes for automated testing
- Proper `id` attributes on forms and sections
- `aria-label` on icon buttons
- Complete `href` attributes on all links
- `name` attributes on form inputs

## 📄 License

MIT License - Internal Use Only

## 🔗 Documentation

For complete requirements, see `ShopSphere_BRD_v1.md`

---

**ShopSphere v1.0.0** | QE Automation Initiative | February 2026
