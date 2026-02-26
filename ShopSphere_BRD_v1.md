Business Requirements Document  |  QE Automation Demo Platform  *|  CONFIDENTIAL*

**BUSINESS REQUIREMENTS DOCUMENT**

QE Automation Demo Platform


|**Field**|**Details**|
| :- | :- |
|Project Name|ShopSphere — QE Demo E-Commerce Platform|
|Document Version|1\.0.0|
|Date|February 2026|
|Prepared For|GitHub Copilot / Claude Opus 4.5 (IDE Generation)|
|Project Type|Demo / Test Harness — Agentic QE System|
|Stack|React (Frontend) + Node.js/Express (Backend)|
|Document Status|APPROVED FOR DEVELOPMENT|

# **Table of Contents**

1\.  Executive Summary	3

2\.  Project Goals & Objectives	3

3\.  Tech Stack Specification	4

4\.  Application Architecture Overview	4

5\.  Frontend Requirements — Pages & Components	5

6\.  Navigation & Link Tree Structure	7

7\.  Backend API Requirements	8

8\.  Data Models	10

9\.  Intentional Bug Catalog	11

10\.  QE Testability Requirements	13

11\.  Project Structure	14

12\.  Acceptance Criteria	15

13\.  Out of Scope	16

# **1. Executive Summary**

This document defines the complete requirements for ShopSphere, a deliberately crafted demo e-commerce web application built as a test harness for an Agentic AI-powered Quality Engineering (QE) automation system.

The platform is not intended for real commercial use. Its purpose is to provide a realistic, multi-layered web application with enough UI complexity, API surface area, DOM depth, and navigational structure to serve as a meaningful target for automated quality engineering workflows — including UI testing, API contract validation, link tree traversal, and intentional bug detection.

The application simulates a functional online store called ShopSphere, selling electronics, apparel, and home goods — all with dummy/seeded data. The AI QE system will be evaluated on its ability to: discover and traverse the full link tree, execute functional UI tests across all major user flows, call and validate API responses, identify pre-planted bugs, and produce structured test reports.

# **2. Project Goals & Objectives**

## **2.1 Primary Goals**
- Provide a realistic e-commerce UI with sufficient element density for AI-driven QE testing
- Expose a REST API backend with well-defined endpoints covering standard CRUD and business operations
- Include a rich, multi-level navigation and link structure for DOM link tree analysis
- Plant specific, reproducible bugs across frontend and backend layers to validate AI defect detection
- Keep the UI clean and professional — functional aesthetics, not over-engineered

## **2.2 Success Criteria**
- The AI QE system can fully traverse all navigable pages from the root
- The AI can identify all pre-planted bugs without manual guidance
- All API endpoints return correct HTTP status codes and response shapes
- The application runs locally with a single startup command

# **3. Tech Stack Specification**

|**Layer**|**Technology**|**Version**|**Notes**|
| :- | :- | :- | :- |
|Frontend|React|18\.x|Vite-based project, no SSR|
|Routing|React Router|v6|Client-side routing|
|Styling|CSS Modules or plain CSS|—|No Tailwind — keep it simple|
|HTTP Client|Axios or native fetch|—|For API calls|
|Backend|Node.js + Express|18\.x / 4.x|REST API server|
|Database|In-memory (JSON array) or lowdb|—|No real DB required|
|CORS|cors npm package|—|Allow localhost:3000|
|Dev Tools|nodemon, concurrently|—|Hot reload both layers|

# **4. Application Architecture Overview**

ShopSphere follows a standard SPA + REST architecture:

- Frontend (React) runs on port 3000
- Backend (Express) runs on port 5000
- Frontend fetches data from backend via REST API calls (no GraphQL)
- All data is seeded in-memory on server start — no persistence between restarts
- Authentication is simulated (hardcoded credentials, JWT-like token in localStorage)

## **4.1 High-Level Component Map**

|**Layer**|**Responsibility**|
| :- | :- |
|React Pages|Render UI views, handle routing, consume API data|
|React Components|Reusable UI elements (ProductCard, Navbar, CartItem, etc.)|
|API Service Layer|Abstracted fetch/axios calls to backend (src/services/api.js)|
|Express Routes|Handle HTTP requests, apply intentional bugs, return JSON|
|Seed Data|Provide realistic dummy products, users, orders|
|Middleware|CORS, JSON body parsing, simple auth header check|

# **5. Frontend Requirements — Pages & Components**

All pages must be accessible via React Router. Each page must have clearly identifiable HTML element IDs and data-testid attributes on interactive elements to support automation targeting.

## **5.1 Page Inventory**

|**Page**|**Route**|**Description**|
| :- | :- | :- |
|Home|/|Hero banner, featured products grid, category links, promotions strip|
|Product Listing|/products|Full product grid with filter sidebar and sort dropdown|
|Product Detail|/products/:id|Product images, description, specs table, reviews, Add to Cart|
|Category Page|/category/:slug|Filtered product grid by category (electronics, apparel, home)|
|Cart|/cart|Cart items list, quantity controls, price summary, Checkout button|
|Checkout|/checkout|Multi-step form: Shipping → Payment → Review → Confirmation|
|Order Confirmation|/order-confirmation|Order number, summary, link back to home|
|Login|/login|Email + password form, remember me checkbox, Forgot Password link|
|Register|/register|Full registration form with validation|
|User Profile|/profile|Account info, order history table, edit form|
|Order History|/orders|Paginated table of past orders with status badges|
|Order Detail|/orders/:id|Single order breakdown with items, shipping, status timeline|
|Wishlist|/wishlist|Saved items grid with Remove and Add to Cart actions|
|Search Results|/search?q=|Search input, result count, filtered product grid|
|About|/about|Company story, team section, contact info|
|Contact|/contact|Contact form (name, email, subject, message) with submit|
|FAQ|/faq|Accordion-style FAQ items across multiple categories|
|404 Not Found|/\*|Error page with home link and suggested navigation|

## **5.2 Required Components**

|**Component**|**Location**|**Key Elements**|
| :- | :- | :- |
|Navbar|src/components/Navbar.jsx|Logo, nav links, search bar, cart icon with badge, user menu|
|Footer|src/components/Footer.jsx|4-column grid: About, Categories, Support, Social links|
|ProductCard|src/components/ProductCard.jsx|Image, name, price, rating stars, Add to Cart, Wishlist toggle|
|CartItem|src/components/CartItem.jsx|Thumbnail, name, quantity stepper, unit price, Remove button|
|FilterSidebar|src/components/FilterSidebar.jsx|Checkboxes for category, price range slider, rating filter|
|StarRating|src/components/StarRating.jsx|5-star SVG display + clickable for review input|
|Breadcrumb|src/components/Breadcrumb.jsx|Dynamic path breadcrumbs with anchor links at each level|
|Pagination|src/components/Pagination.jsx|Page number buttons, prev/next, items-per-page dropdown|
|StatusBadge|src/components/StatusBadge.jsx|Color-coded status labels: Pending, Shipped, Delivered, Cancelled|
|Modal|src/components/Modal.jsx|Reusable overlay with close button and trap focus|
|Toast|src/components/Toast.jsx|Success/error/info notification system|
|Accordion|src/components/Accordion.jsx|Expand/collapse sections for FAQ|
|CheckoutStepper|src/components/CheckoutStepper.jsx|Step indicator with active/completed state|

# **6. Navigation & Link Tree Structure**

This section is critical for the AI's link tree DOM traversal capability. Every link must be rendered as a proper <a> tag or React Router <Link> with a meaningful href/to attribute. All nav sections below must be present and discoverable.

## **6.1 Primary Navigation (Navbar)**
- Home  →  /
- Products  →  /products
- Categories (dropdown)
  - Electronics  →  /category/electronics
  - Apparel  →  /category/apparel
  - Home & Garden  →  /category/home
  - Deals  →  /category/deals
- About  →  /about
- Contact  →  /contact

## **6.2 Footer Link Tree (4 Columns)**

|**Column 1: Company**|**Column 2: Shop**|**Column 3: Support**|**Column 4: Social**|
| :- | :- | :- | :- |
|About Us  /about|All Products  /products|FAQ  /faq|Twitter (external)|
|Careers  /careers (404)|Electronics  /category/electronics|Contact Us  /contact|Instagram (external)|
|Blog  /blog (404)|Apparel  /category/apparel|Return Policy  /returns (404)|LinkedIn (external)|
|Press  /press (404)|Home & Garden  /category/home|Shipping Info  /shipping (404)|Facebook (external)|
|Privacy Policy  /privacy|Deals  /category/deals|Size Guide  /size-guide (404)|YouTube (external)|
|Terms of Service  /terms|Wishlist  /wishlist|Order Tracking  /order-track|—|

Note: 404-mapped routes are intentional — they test the AI's ability to detect broken internal links.

## **6.3 In-Page Anchor Links**
- Home page: #featured, #categories, #promotions, #newsletter
- About page: #our-story, #team, #values, #contact-info
- FAQ page: #shipping-faq, #returns-faq, #account-faq, #payment-faq
- Product detail: #description, #specifications, #reviews, #related-products

## **6.4 Breadcrumb Navigation**
Every product and category page must render a breadcrumb trail. Example:

- Home  /  Products  /  Electronics  /  Wireless Headphones

Each segment must be an anchor tag pointing to its respective route.

# **7. Backend API Requirements**

The backend is an Express.js REST API running on port 5000. Base URL: http://localhost:5000/api. All responses are JSON. All endpoints should return appropriate HTTP status codes.

## **7.1 Products API**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|GET|/api/products|List all products (supports ?category=, ?sort=, ?q=, ?limit=, ?page=)|{ products[], total, page }|
|GET|/api/products/:id|Get single product by ID|{ product } or 404|
|GET|/api/products/featured|Get featured products (max 8)|{ products[] }|
|GET|/api/products/:id/reviews|Get reviews for a product|{ reviews[], averageRating }|
|POST|/api/products/:id/reviews|Submit a review (auth required)|{ review } or 401|

## **7.2 Categories API**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|GET|/api/categories|List all categories|{ categories[] }|
|GET|/api/categories/:slug|Get category info + product count|{ category, productCount }|

## **7.3 Cart API**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|GET|/api/cart|Get current cart (session/token based)|{ items[], subtotal, tax, total }|
|POST|/api/cart/add|Add item { productId, quantity } to cart|{ cart }|
|PUT|/api/cart/update|Update quantity { productId, quantity }|{ cart }|
|DELETE|/api/cart/remove/:productId|Remove item from cart|{ cart }|
|DELETE|/api/cart/clear|Empty the cart|{ message }|

## **7.4 Orders API**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|GET|/api/orders|List orders for authenticated user|{ orders[] }|
|GET|/api/orders/:id|Get single order detail|{ order } or 404|
|POST|/api/orders|Place order from current cart|{ order } or 400|
|GET|/api/orders/:id/track|Get order tracking timeline|{ timeline[] }|

## **7.5 Auth API**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|POST|/api/auth/login|Login { email, password } → returns token|{ token, user } or 401|
|POST|/api/auth/register|Register new user|{ token, user } or 400|
|POST|/api/auth/logout|Invalidate session token|{ message }|
|GET|/api/auth/me|Get authenticated user profile (auth required)|{ user } or 401|

## **7.6 Wishlist & Search APIs**

|**Method**|**Endpoint**|**Description**|**Response**|
| :- | :- | :- | :- |
|GET|/api/wishlist|Get user wishlist|{ items[] }|
|POST|/api/wishlist/add|Add product to wishlist|{ wishlist }|
|DELETE|/api/wishlist/remove/:id|Remove from wishlist|{ wishlist }|
|GET|/api/search?q=|Full-text product search|{ results[], count }|
|POST|/api/contact|Submit contact form message|{ message: 'sent' }|

# **8. Data Models**

## **8.1 Product**

|**Field**|**Type**|**Example**|
| :- | :- | :- |
|id|string|prod\_001|
|name|string|Sony WH-1000XM5 Headphones|
|category|string|electronics|
|price|number|349\.99|
|originalPrice|number|429\.99  (for discount display)|
|images|string[]|["/images/prod\_001\_a.jpg"]|
|description|string|Long-form product description text|
|specs|object|{ weight: '250g', battery: '30h', ... }|
|stock|number|42|
|rating|number|4\.3|
|reviewCount|number|128|
|featured|boolean|true|
|tags|string[]|['wireless', 'noise-cancelling']|

## **8.2 User**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|id|string|user\_001|
|email|string|Used for login|
|password|string (hashed mock)|Seeded: password123|
|firstName|string|—|
|lastName|string|—|
|address|object|{ street, city, state, zip, country }|
|createdAt|ISO date string|—|

## **8.3 Order**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|id|string|ord\_001|
|userId|string|Reference to user|
|items|array|[{ productId, name, quantity, unitPrice }]|
|subtotal|number|—|
|tax|number|—|
|shipping|number|—|
|total|number|—|
|status|enum|pending | processing | shipped | delivered | cancelled|
|shippingAddress|object|—|
|createdAt|ISO date string|—|
|timeline|array|[{ status, timestamp, message }]|

# **9. Intentional Bug Catalog**

The following bugs are deliberately introduced into the application. Each bug is documented with its location, type, symptom, and expected AI detection behavior. These bugs should NOT be fixed during development — they are the test targets.

## **9.1 Frontend Bugs**

|**Bug ID**|**Component**|**Type**|**Description**|**Expected Detection**|
| :- | :- | :- | :- | :- |
|BUG-F01|ProductCard.jsx|Logic Error|Price displayed without decimal formatting — 34999 instead of $349.99 when price > 999|AI asserts price format matches regex /^\$[\d,]+\.\d{2}$/|
|BUG-F02|Cart Page|State Bug|Quantity stepper allows setting quantity to 0 but does not remove the item — item stays in cart with qty 0|AI tests decrement to 0 and asserts item is removed|
|BUG-F03|Checkout Form|Validation Missing|Email field on checkout accepts invalid email format (e.g. 'notanemail') and allows form submission|AI submits invalid email, asserts validation error appears|
|BUG-F04|Search Results|UI Bug|Search result count displays 'Showing NaN results' when query returns 0 results|AI searches for 'xyznonexistent', asserts count is '0 results'|
|BUG-F05|Product Detail|Broken Link|Related Products section renders anchor tags with href='#' instead of actual product URLs|AI traverses link tree, flags href='#' as broken/unresolved links|
|BUG-F06|Login Page|UX Bug|Password field temporarily flashes plain text for ~200ms when the Show Password toggle is clicked|AI inspects input type attribute transition|
|BUG-F07|Order History|Display Bug|Order date renders as raw ISO string (2026-01-15T10:30:00Z) instead of formatted date|AI asserts date fields match formatted date pattern|
|BUG-F08|Footer|Broken Link|Careers and Blog footer links navigate to pages that return 404 — not caught or flagged|AI traverses footer links, identifies 404 responses|

## **9.2 Backend / API Bugs**

|**Bug ID**|**Endpoint**|**Type**|**Description**|**Expected Detection**|
| :- | :- | :- | :- | :- |
|BUG-B01|GET /api/products|Wrong Status Code|When ?category= param is invalid/unknown, returns 200 with empty array instead of 400 Bad Request|AI sends invalid category, asserts response is 400|
|BUG-B02|POST /api/cart/add|Missing Validation|Adding a product with quantity: -1 is accepted without error — negative items added to cart|AI posts qty:-1, asserts 400 validation error|
|BUG-B03|GET /api/products/:id|Wrong Field Name|Response returns productName instead of name — inconsistent with product list endpoint schema|AI compares field names between list and detail responses|
|BUG-B04|POST /api/orders|Silent Failure|If cart is empty, order is created with items:[] and total:0 instead of returning 400 error|AI places order with empty cart, asserts 400 response|
|BUG-B05|GET /api/orders/:id|Auth Bypass|Returns order details without checking if the order belongs to the requesting user — any authenticated user can view any order|AI accesses another user's order ID, asserts 403|
|BUG-B06|GET /api/products/featured|Pagination Ignored|Returns all featured products regardless of limit param — limit=2 still returns 8 products|AI calls with limit=2, asserts response length <= 2|
|BUG-B07|POST /api/contact|Missing Field|Response body is empty {} instead of { message: 'sent' } on success|AI posts contact form, asserts response has message field|
|BUG-B08|POST /api/auth/register|No Duplicate Check|Registering with an already-used email returns 200 instead of 409 Conflict|AI registers same email twice, asserts second call is 409|

# **10. QE Testability Requirements**

All interactive elements must follow these testability conventions to ensure the AI QE system can locate and interact with them reliably.

## **10.1 Element Identification Standards**

|**Convention**|**Rule**|**Example**|
| :- | :- | :- |
|data-testid|Every interactive element must have a data-testid attribute|data-testid="add-to-cart-btn"|
|id attributes|All forms, major sections, and page containers must have an id|id="checkout-form", id="product-grid"|
|aria-label|Icon-only buttons must have aria-label|aria-label="Add to wishlist"|
|name attributes|All form inputs must have a name attribute|name="email", name="quantity"|
|href completeness|All anchor tags must have non-empty href (no bare href='#' except intentional bugs)|href="/products/prod\_001"|

## **10.2 Required data-testid Values**
The following data-testid attributes are mandatory across the application:

|**Element**|**data-testid Value**|
| :- | :- |
|Navbar logo link|navbar-logo|
|Cart icon + badge|cart-icon, cart-badge|
|Search input|search-input|
|Product card (each)|product-card-{id}|
|Add to cart button|add-to-cart-{id}|
|Quantity decrement|qty-decrement|
|Quantity increment|qty-increment|
|Quantity input|qty-input|
|Remove from cart|remove-cart-item-{id}|
|Checkout button|proceed-to-checkout|
|Login form submit|login-submit|
|Register form submit|register-submit|
|Filter checkbox|filter-{category}|
|Sort dropdown|sort-select|
|Pagination buttons|page-btn-{n}, page-prev, page-next|
|Order status badge|order-status-{orderId}|

# **11. Project Structure**

The repository should be structured as a monorepo with two packages: /frontend and /backend. A root package.json should include a dev script that starts both concurrently.

## **11.1 Frontend Structure (React + Vite)**

|**Path**|**Purpose**|
| :- | :- |
|frontend/src/pages/|One file per page (HomePage.jsx, ProductListPage.jsx, etc.)|
|frontend/src/components/|All reusable components|
|frontend/src/services/api.js|All Axios/fetch API calls abstracted here|
|frontend/src/context/|React Context: CartContext, AuthContext, WishlistContext|
|frontend/src/hooks/|Custom hooks: useCart, useAuth, useProducts|
|frontend/src/utils/|Formatters, validators, constants|
|frontend/src/styles/|Global CSS, CSS modules|
|frontend/src/App.jsx|Root component with Router and Route definitions|
|frontend/src/main.jsx|Vite entry point|

## **11.2 Backend Structure (Node.js + Express)**

|**Path**|**Purpose**|
| :- | :- |
|backend/src/routes/|Express routers: products.js, cart.js, orders.js, auth.js, etc.|
|backend/src/middleware/|auth.js (token check), errorHandler.js|
|backend/src/data/|Seed data files: products.json, users.json, orders.json|
|backend/src/utils/|Response helpers, formatters|
|backend/server.js|Express app entry point, middleware setup, route mounting|
|backend/.env|PORT=5000, JWT\_SECRET=dev\_secret|

## **11.3 Root Scripts**

|**Command**|**Action**|
| :- | :- |
|npm run dev|Start both frontend (port 3000) and backend (port 5000) concurrently|
|npm run dev:frontend|Start only Vite dev server|
|npm run dev:backend|Start only Express with nodemon|
|npm run seed|Re-seed all in-memory data (if applicable)|

# **12. Acceptance Criteria**

The following conditions must be met before the application is considered ready for QE system testing:

## **12.1 Application Readiness**
1. Application starts with a single npm run dev from root
1. All 18 frontend routes are accessible and render without console errors (except intentional bugs)
1. All 24+ API endpoints return JSON responses with correct Content-Type header
1. Seeded data includes: minimum 20 products across 3 categories, 3 user accounts, 5 pre-existing orders
1. All data-testid attributes are implemented per Section 10.2
1. Link tree includes minimum 40 unique anchor tags discoverable from the root URL

## **12.2 Bug Implementation Verification**
1. All 8 frontend bugs (BUG-F01 through BUG-F08) are reproducible as described
1. All 8 backend bugs (BUG-B01 through BUG-B08) are reproducible as described
1. Bugs do not cascade — each bug is isolated and does not prevent other features from functioning

# **13. Out of Scope**

The following are explicitly excluded from this project:

- Real payment processing (no Stripe, PayPal, or similar)
- Real email delivery (no SMTP, SendGrid, etc.)
- Persistent database (no PostgreSQL, MongoDB, or similar — in-memory only)
- File uploads or image management
- Real-time features (no WebSockets)
- Mobile app or PWA
- Internationalization (i18n)
- Production deployment or CI/CD pipelines
- Unit or integration test files (the AI QE system writes these)

**END OF DOCUMENT**

*ShopSphere QE Demo Platform  •  BRD v1.0.0  •  February 2026*
© 2026 QE Automation Initiative — Internal Use Only	Page 
