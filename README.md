# ShopSphere — QE Automation Demo Platform

A deliberately crafted demo e-commerce application designed as a test harness for Agentic AI QE systems.

## Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start both frontend and backend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health check**: http://localhost:5000/api/health

## Demo Credentials

| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |
| test@test.com | test123 |

## Intentional Bugs (For QE Testing)

### Frontend Bugs
| ID | Location | Description |
|----|----------|-------------|
| BUG-F01 | ProductCard | Price > $999 renders without decimal (e.g. `$34999` instead of `$349.99`) |
| BUG-F02 | Cart Page | Qty stepper allows 0, item stays in cart instead of being removed |
| BUG-F03 | Checkout | Email field accepts invalid format (no regex validation) |
| BUG-F04 | Search | Zero results shows "Showing NaN results" |
| BUG-F05 | Product Detail | Related products use `href="#"` instead of real product URLs |
| BUG-F06 | Login | Password field briefly flashes plain text when toggling visibility |
| BUG-F07 | Order History | Dates display as raw ISO string instead of formatted date |
| BUG-F08 | Footer | Careers & Blog links navigate to 404 pages |

### Backend Bugs
| ID | Endpoint | Description |
|----|----------|-------------|
| BUG-B01 | GET /api/products | Unknown `?category=` returns 200+[] instead of 400 |
| BUG-B02 | POST /api/cart/add | Negative quantity accepted without validation |
| BUG-B03 | GET /api/products/:id | Returns `productName` field instead of `name` |
| BUG-B04 | POST /api/orders | Empty cart creates order with total:0 instead of 400 |
| BUG-B05 | GET /api/orders/:id | No ownership check — any user can view any order |
| BUG-B06 | GET /api/products/featured | `limit` param is ignored |
| BUG-B07 | POST /api/contact | Response body is `{}` instead of `{ message: 'sent' }` |
| BUG-B08 | POST /api/auth/register | Duplicate email registration returns 200 instead of 409 |

## Stack
- **Frontend**: React 18 + React Router v6 + Vite
- **Backend**: Node.js + Express 4
- **Data**: In-memory (resets on server restart)
