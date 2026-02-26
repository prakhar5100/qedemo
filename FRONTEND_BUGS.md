# Frontend Bugs Documentation

This document catalogs all intentional bugs planted in the ShopSphere frontend for QE agent testing practice.

---

## Bug Categories

- **Display & Formatting**: Visual rendering issues
- **Validation & Logic**: Missing or incorrect validation
- **User Feedback**: Silent failures or missing feedback
- **State Management**: Incorrect state handling

---

## Bug List

### BUG-F01: Price Formatting Breaks for Items Over $999
**Location:** [frontend/src/components/ProductCard.jsx](frontend/src/components/ProductCard.jsx#L4-L10)

**Bug ID:** F01  
**Severity:** Medium  
**Category:** Display & Formatting

**Description:**  
The `formatPrice()` function removes the decimal point for prices over $999, causing $349.99 to display as "$34999".

**Expected Behavior:**  
All prices should display with 2 decimal places: `$349.99`, `$1,299.99`

**Actual Behavior:**  
Prices over $999 show without decimal: `$34999`, `$129999`

**Code Issue:**
```javascript
function formatPrice(price) {
  const str = price.toString();
  if (price > 999) {
    return '$' + str.replace('.', ''); // BUG: Removes decimal point
  }
  return '$' + price.toFixed(2);
}
```

**Test Scenario:**
1. Navigate to product list page
2. Find product with price > $999 (e.g., laptop at $1,299.99)
3. Observe price display shows "$129999"

**Fix:**
```javascript
function formatPrice(price) {
  return '$' + price.toFixed(2);
}
```

---

### BUG-F02: Cart Quantity Can Be Set to 0 Without Removing Item
**Location:** [frontend/src/pages/CartPage.jsx](frontend/src/pages/CartPage.jsx#L38-L43)

**Bug ID:** F02  
**Severity:** Medium  
**Category:** Validation & Logic

**Description:**  
The quantity decrement button allows setting quantity to 0, but the item remains in cart instead of being removed.

**Expected Behavior:**  
When quantity reaches 0, item should be automatically removed from cart.

**Actual Behavior:**  
Item stays in cart with quantity 0, showing $0.00 subtotal.

**Code Issue:**
```javascript
const handleQtyChange = async (productId, val) => {
  const qty = parseInt(val);
  // BUG: Should remove item when qty reaches 0
  await updateItem(productId, qty); // allows qty=0
};
```

**Test Scenario:**
1. Add item to cart
2. Click decrement button until quantity shows 0
3. Observe item remains in cart with 0 quantity

**Fix:**
```javascript
const handleQtyChange = async (productId, val) => {
  const qty = parseInt(val);
  if (qty <= 0) { 
    await removeItem(productId); 
    return; 
  }
  await updateItem(productId, qty);
};
```

---

### BUG-F03: Email Validation Missing in Checkout Form
**Location:** [frontend/src/pages/CheckoutPage.jsx](frontend/src/pages/CheckoutPage.jsx#L20-L30)

**Bug ID:** F03  
**Severity:** High  
**Category:** Validation & Logic

**Description:**  
Checkout shipping form accepts any text as email (e.g., "notanemail") without format validation. Input type is `text` instead of `email`, and no regex validation exists.

**Expected Behavior:**  
Email field should validate format (contains @ and domain) and show error for invalid emails.

**Actual Behavior:**  
Any string passes validation: "abc", "123", "@@@" all accepted.

**Code Issue:**
```javascript
// Line 58: type="text" instead of type="email"
<input name="email" type="text" className={...} />

// validateShipping() missing email format check:
const validateShipping = () => {
  const e = {};
  if (!shipping.email) e.email = 'Required';
  // BUG: Missing format validation
  setErrors(e);
  return Object.keys(e).length === 0;
};
```

**Test Scenario:**
1. Go to checkout page
2. Enter "notanemail" in email field
3. Click "Continue to Payment"
4. Form proceeds without error

**Fix:**
```javascript
<input name="email" type="email" ... />

// In validateShipping():
if (shipping.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
  e.email = 'Invalid email format';
}
```

---

### BUG-F04: Search Results Show "NaN" When Count is 0
**Location:** [frontend/src/pages/SearchPage.jsx](frontend/src/pages/SearchPage.jsx#L21-L23)

**Bug ID:** F04  
**Severity:** Low  
**Category:** Display & Formatting

**Description:**  
When search returns 0 results, the result text displays "Showing NaN results" because the ternary condition treats 0 as falsy.

**Expected Behavior:**  
Should display "Showing 0 results for 'query'"

**Actual Behavior:**  
Displays "Showing NaN results for 'query'"

**Code Issue:**
```javascript
const resultText = `Showing ${count !== 0 ? count : NaN} results for "${query}"`;
// BUG: count=0 is falsy, so fallback produces NaN
```

**Test Scenario:**
1. Search for non-existent product: "asdfghjkl12345"
2. Observe text shows "Showing NaN results"

**Fix:**
```javascript
const resultText = `Showing ${count} results for "${query}"`;
```

---

### BUG-F05: Cart Badge Shows Count + 1
**Location:** [frontend/src/components/Navbar.jsx](frontend/src/components/Navbar.jsx#L70-L74)

**Bug ID:** F05  
**Severity:** Medium  
**Category:** Display & Formatting

**Description:**  
Navigation cart badge displays `itemCount + 1`, showing "4" when cart actually has 3 items.

**Expected Behavior:**  
Badge should show exact number of items in cart.

**Actual Behavior:**  
Badge shows 1 more than actual count.

**Code Issue:**
```javascript
{itemCount > 0 && (
  <span data-testid="cart-badge" ...>{itemCount + 1}</span> // BUG: +1
)}
```

**Test Scenario:**
1. Add 3 items to cart
2. Check navbar cart badge
3. Badge shows "4"

**Fix:**
```javascript
<span data-testid="cart-badge" ...>{itemCount}</span>
```

---

### BUG-F06: SALE Badge Appears on Non-Discounted Items
**Location:** [frontend/src/components/ProductCard.jsx](frontend/src/components/ProductCard.jsx#L40)

**Bug ID:** F06  
**Severity:** Low  
**Category:** Validation & Logic

**Description:**  
"SALE" badge shows when `originalPrice >= price` instead of `originalPrice > price`, displaying sale badge even when prices are identical.

**Expected Behavior:**  
Sale badge only appears when original price is greater than current price.

**Actual Behavior:**  
Sale badge appears when prices are equal (no actual discount).

**Code Issue:**
```javascript
const hasDiscount = product.originalPrice >= product.price; // BUG: includes equal
```

**Test Scenario:**
1. Find product where originalPrice === price (e.g., $99.99 = $99.99)
2. Product card incorrectly shows "SALE" badge

**Fix:**
```javascript
const hasDiscount = product.originalPrice > product.price;
```

---

### BUG-F07: Order Dates Display Raw ISO String
**Location:** [frontend/src/pages/OrdersPage.jsx](frontend/src/pages/OrdersPage.jsx#L34)

**Bug ID:** F07  
**Severity:** Medium  
**Category:** Display & Formatting

**Description:**  
Order dates render as raw ISO timestamp string (e.g., "2026-02-26T10:30:45.123Z") instead of formatted date.

**Expected Behavior:**  
Display formatted date: "Feb 26, 2026" or "2/26/2026"

**Actual Behavior:**  
Shows "2026-02-26T10:30:45.123Z"

**Code Issue:**
```javascript
<td style={{ fontSize: 13 }}>{order.createdAt}</td>
// BUG: Renders raw ISO string
```

**Test Scenario:**
1. Place an order
2. Navigate to "My Orders" page
3. Date column shows ISO timestamp

**Fix:**
```javascript
<td style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
```

---

### BUG-F08: Search Query Not Trimmed
**Location:** [frontend/src/pages/SearchPage.jsx](frontend/src/pages/SearchPage.jsx#L11)

**Bug ID:** F08  
**Severity:** Low  
**Category:** Validation & Logic

**Description:**  
Search query extracts raw URL parameter without trimming whitespace. Searching for "  laptop  " (with spaces) produces different results than "laptop".

**Expected Behavior:**  
Leading/trailing whitespace should be removed from search query.

**Actual Behavior:**  
Whitespace included in search, causing inconsistent results.

**Code Issue:**
```javascript
const query = new URLSearchParams(location.search).get('q') || '';
// BUG: Not trimmed
```

**Test Scenario:**
1. Search for "  laptop  " (with extra spaces)
2. May return 0 results or different results than "laptop"

**Fix:**
```javascript
const query = (new URLSearchParams(location.search).get('q') || '').trim();
```

---

### BUG-F09: Star Rating Ceiling Instead of Rounding
**Location:** [frontend/src/components/ProductCard.jsx](frontend/src/components/ProductCard.jsx#L66)

**Bug ID:** F09  
**Severity:** Low  
**Category:** Display & Formatting

**Description:**  
Product rating uses `Math.ceil()` causing 3.1★ rating to display 4 stars. Should use `Math.floor()` or proper rounding.

**Expected Behavior:**  
3.1 stars → 3★, 3.5 stars → 4★ (or 3.5★), 3.9 stars → 4★

**Actual Behavior:**  
3.1 stars → 4★ (inflated rating display)

**Code Issue:**
```javascript
<span className="stars">{'★'.repeat(Math.ceil(product.rating))}</span>
// BUG: Ceil rounds 3.1 up to 4
```

**Test Scenario:**
1. Find product with rating like 3.1 or 3.2
2. Product card shows 4 filled stars instead of 3

**Fix:**
```javascript
<span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
// Or use Math.round() for 3.5 → 4
```

---

### BUG-F10: Out-of-Stock Items Can Be Added to Cart
**Location:** [frontend/src/pages/ProductDetailPage.jsx](frontend/src/pages/ProductDetailPage.jsx#L40-L45)

**Bug ID:** F10  
**Severity:** High  
**Category:** Validation & Logic

**Description:**  
Product detail page allows adding out-of-stock items (stock=0) to cart. No validation prevents this despite showing "Out of Stock" message.

**Expected Behavior:**  
"Add to Cart" should be disabled or show error toast when stock is 0.

**Actual Behavior:**  
Button is clickable and attempts to add unavailable item to cart.

**Code Issue:**
```javascript
const handleAddToCart = async () => {
  if (!isAuth) { addToast('Please sign in to add items to cart', 'info'); return; }
  // BUG: Missing stock check
  try { await addItem(product.id, quantity); ... }
};
```

**Test Scenario:**
1. Navigate to product with stock=0
2. Click "Add to Cart"
3. Item gets added despite being unavailable

**Fix:**
```javascript
const handleAddToCart = async () => {
  if (!isAuth) { addToast('Please sign in to add items to cart', 'info'); return; }
  if (product.stock === 0) { 
    addToast('Item is out of stock', 'error'); 
    return; 
  }
  try { await addItem(product.id, quantity); ... }
};
```

---

### BUG-F11: Quantity Can Exceed Available Stock
**Location:** [frontend/src/pages/ProductDetailPage.jsx](frontend/src/pages/ProductDetailPage.jsx#L91)

**Bug ID:** F11  
**Severity:** High  
**Category:** Validation & Logic

**Description:**  
Quantity increment button has no upper limit validation. User can order 999 units when only 5 are available in stock.

**Expected Behavior:**  
Quantity should be capped at available stock count.

**Actual Behavior:**  
Unlimited quantity increase allowed.

**Code Issue:**
```javascript
<button data-testid="qty-increment" 
  onClick={() => setQuantity(q => q + 1)} ...>+</button>
// BUG: No max limit check
```

**Test Scenario:**
1. View product with stock=5
2. Click increment button 20 times
3. Quantity reaches 20 (exceeds stock)

**Fix:**
```javascript
<button data-testid="qty-increment" 
  onClick={() => setQuantity(q => Math.min(q + 1, product.stock))} ...>+</button>
```

---

### BUG-F12: Newsletter Form Submit Has No Feedback
**Location:** [frontend/src/pages/HomePage.jsx](frontend/src/pages/HomePage.jsx#L92-L96)

**Bug ID:** F12  
**Severity:** Low  
**Category:** User Feedback

**Description:**  
Newsletter subscription form has `onSubmit={e => e.preventDefault()}` with no success/error messaging. User clicks "Subscribe" and nothing visible happens.

**Expected Behavior:**  
Show success toast or confirmation message after submission.

**Actual Behavior:**  
Complete silence - appears broken to users.

**Code Issue:**
```javascript
<form style={{ display: 'flex', gap: 0 }} onSubmit={e => e.preventDefault()}>
  {/* BUG: No feedback, no API call, just prevents default */}
```

**Test Scenario:**
1. Enter email in newsletter input
2. Click "Subscribe"
3. No visual feedback occurs

**Fix:**
```javascript
const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  // Call API and show toast
  addToast('Thanks for subscribing!', 'success');
};
<form onSubmit={handleNewsletterSubmit}>...</form>
```

---

### BUG-F13: Pagination Doesn't Reset on Filter Change
**Location:** [frontend/src/pages/ProductListPage.jsx](frontend/src/pages/ProductListPage.jsx#L30)

**Bug ID:** F13  
**Severity:** Medium  
**Category:** State Management

**Description:**  
When user changes filters/sort while on page 5, pagination stays on page 5. If filter results have fewer pages, user sees empty page.

**Expected Behavior:**  
Changing filters should reset pagination to page 1.

**Actual Behavior:**  
Page number persists across filter changes.

**Code Issue:**
```javascript
{/* BUG: setPage(1) removed from onChange */}
<FilterSidebar filters={filters} onChange={f => { setFilters(f); }} ... />
```

**Test Scenario:**
1. Navigate to page 5 of products
2. Change category filter
3. Still on page 5 but new filter may only have 2 pages (shows empty)

**Fix:**
```javascript
<FilterSidebar filters={filters} onChange={f => { setFilters(f); setPage(1); }} ... />
```

---

### BUG-F14: Duplicate Order Submissions Possible
**Location:** [frontend/src/pages/CheckoutPage.jsx](frontend/src/pages/CheckoutPage.jsx#L28-L35)

**Bug ID:** F14  
**Severity:** High  
**Category:** State Management

**Description:**  
"Place Order" button has no loading/disabled state during API call. User can click multiple times rapidly, creating duplicate orders.

**Expected Behavior:**  
Button should be disabled during order submission.

**Actual Behavior:**  
Multiple clicks create multiple orders.

**Code Issue:**
```javascript
const handlePlaceOrder = async () => {
  // BUG: No loading state to prevent duplicate submissions
  try {
    const data = await placeOrder({ shippingAddress: shipping });
    ...
  }
};
```

**Test Scenario:**
1. Proceed to checkout review step
2. Rapidly click "Place Order" 5 times
3. 5 duplicate orders created

**Fix:**
```javascript
const [submitting, setSubmitting] = useState(false);

const handlePlaceOrder = async () => {
  if (submitting) return;
  setSubmitting(true);
  try {
    const data = await placeOrder({ shippingAddress: shipping });
    ...
  } finally {
    setSubmitting(false);
  }
};

<button onClick={handlePlaceOrder} disabled={submitting} ...>
  {submitting ? 'Processing...' : 'Place Order ✓'}
</button>
```

---

### BUG-F15: Login Page Accessible When Already Logged In
**Location:** [frontend/src/pages/LoginPage.jsx](frontend/src/pages/LoginPage.jsx#L6-L15)

**Bug ID:** F15  
**Severity:** Medium  
**Category:** Validation & Logic

**Description:**  
Authenticated users can navigate to `/login` page and see the login form. There's no redirect to home page for already-logged-in users.

**Expected Behavior:**  
When logged-in user visits `/login`, should automatically redirect to home page or dashboard.

**Actual Behavior:**  
Login page displays normally even when user is authenticated.

**Code Issue:**
```javascript
export default function LoginPage() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();

  // BUG-F15: Missing redirect check — logged-in users can access /login page
  // Should have: useEffect(() => { if (isAuth) navigate('/'); }, [isAuth, navigate]);

  // ... rest of component
}
```

**Test Scenario:**
1. Log in to the application
2. Manually navigate to `/login` route
3. Login form is displayed despite being authenticated
4. User could potentially log in again or see confusing UI

**Fix:**
```javascript
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  // ... rest of component
}
```

---

### BUG-F16: Shipping Address Form Submits With Empty Fields
**Location:** [frontend/src/pages/CheckoutPage.jsx](frontend/src/pages/CheckoutPage.jsx#L23-L36)

**Bug ID:** F16  
**Severity:** Critical  
**Category:** Validation & Logic

**Description:**  
The `validateShipping()` function always returns `true`, allowing the checkout form to proceed to payment step even when all required fields are empty. Validation errors are collected but ignored.

**Expected Behavior:**  
Form should not proceed if any required field is empty. User should see error messages.

**Actual Behavior:**  
Form proceeds to next step regardless of validation errors. Empty order data sent to backend.

**Code Issue:**
```javascript
const validateShipping = () => {
  const e = {};
  if (!shipping.firstName) e.firstName = 'Required';
  if (!shipping.lastName) e.lastName = 'Required';
  if (!shipping.street) e.street = 'Required';
  if (!shipping.city) e.city = 'Required';
  if (!shipping.zip) e.zip = 'Required';
  if (!shipping.email) e.email = 'Required';
  setErrors(e);
  
  // BUG-F16: Always returns true regardless of validation errors!
  return true; // Should check if errors object is empty
};
```

**Test Scenario:**
1. Add items to cart and proceed to checkout
2. Click "Continue to Payment" without filling any fields
3. Form errors briefly appear but form still advances to payment step
4. Can potentially place order with no shipping address

**Fix:**
```javascript
const validateShipping = () => {
  const e = {};
  if (!shipping.firstName) e.firstName = 'Required';
  if (!shipping.lastName) e.lastName = 'Required';
  if (!shipping.street) e.street = 'Required';
  if (!shipping.city) e.city = 'Required';
  if (!shipping.zip) e.zip = 'Required';
  if (!shipping.email) e.email = 'Required';
  setErrors(e);
  
  // Return false if there are any errors
  return Object.keys(e).length === 0;
};
```

---

## Testing Strategy

### Automated Test Coverage
For each bug, QE agents should:
1. Write failing test that demonstrates the bug
2. Implement fix
3. Verify test passes
4. Add regression test to suite

### Test Priority
- **Critical Severity** (F16): Test immediately - data integrity failure
- **High Severity** (F03, F10, F11, F14): Test first - data integrity and validation
- **Medium Severity** (F01, F02, F05, F07, F13, F15): Test second - user experience issues
- **Low Severity** (F04, F06, F08, F09, F12): Test last - minor display/UX issues

### Example Test Cases
```javascript
// Example for BUG-F05
describe('Cart Badge', () => {
  it('should display exact item count', () => {
    addItemToCart(productA);
    addItemToCart(productB);
    addItemToCart(productC);
    expect(cartBadge).toHaveText('3'); // Will fail, shows '4'
  });
});

// Example for BUG-F11
describe('Product Quantity', () => {
  it('should not exceed available stock', () => {
    const product = { id: 1, stock: 5 };
    incrementQuantity(10); // Try to set quantity to 11
    expect(getQuantity()).toBe(5); // Should cap at stock
  });
});
```

---

## Bug Statistics

- **Total Bugs:** 16
- **Critical Severity:** 1 (6%)
- **High Severity:** 4 (25%)
- **Medium Severity:** 7 (44%)
- **Low Severity:** 4 (25%)

**By Category:**
- Validation & Logic: 9 bugs
- Display & Formatting: 5 bugs
- State Management: 2 bugs
- User Feedback: 1 bug

---

## Notes for QE Agents

1. All bugs **compile successfully** - no syntax errors
2. All bugs cause **observable behavior** - can be caught by E2E/integration tests
3. Bugs are **realistic** - common mistakes developers make
4. Each bug has **clear fix** - not overly complex to resolve
5. Bugs are **independent** - fixing one doesn't fix others

Good luck testing! 🧪
