import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import CheckoutStepper from '../components/CheckoutStepper';
import Breadcrumb from '../components/Breadcrumb';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.address) {
      setShippingInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zip: user.address.zip || '',
        country: user.address.country || 'USA'
      });
    }
  }, [user]);

  // BUG-F03: Email validation is missing - accepts invalid email formats
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email required';
    // BUG-F03: Missing email format validation
    // Should have: if (!validateEmail(shippingInfo.email)) newErrors.email = 'Invalid email';
    if (!shippingInfo.street.trim()) newErrors.street = 'Street address required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State required';
    if (!shippingInfo.zip.trim()) newErrors.zip = 'ZIP code required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};

    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number required';
    }
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name required';
    if (!paymentInfo.expiry) newErrors.expiry = 'Expiry date required';
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        shippingAddress: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country
        },
        paymentMethod: 'card'
      };

      const response = await ordersAPI.create(orderData);
      await clearCart();
      
      // Store order ID for confirmation page
      navigate('/order-confirmation', { 
        state: { orderId: response.data.order.id } 
      });
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: null }
  ];

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <p>Your cart is empty. Please add items before checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" id="checkout-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>Checkout</h1>

        <CheckoutStepper currentStep={currentStep} />

        <div className="checkout-container">
          <div className="checkout-main">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>
                <form id="checkout-form" className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                      className={errors.street ? 'error' : ''}
                    />
                    {errors.street && <span className="error-text">{errors.street}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className={errors.state ? 'error' : ''}
                      />
                      {errors.state && <span className="error-text">{errors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                        className={errors.zip ? 'error' : ''}
                      />
                      {errors.zip && <span className="error-text">{errors.zip}</span>}
                    </div>
                  </div>
                </form>

                <button onClick={handleNext} className="next-btn">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <h2>Payment Information</h2>
                <form className="checkout-form">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      maxLength="16"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                        className={errors.expiry ? 'error' : ''}
                      />
                      {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        maxLength="4"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                    </div>
                  </div>
                </form>

                <div className="checkout-buttons">
                  <button onClick={() => setCurrentStep(1)} className="back-btn">
                    Back
                  </button>
                  <button onClick={handleNext} className="next-btn">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>

                <div className="review-section">
                  <h3>Shipping Address</h3>
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.street}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                  <p>{shippingInfo.email}</p>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  {cart.items.map(item => (
                    <div key={item.productId} className="review-item">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-buttons">
                  <button onClick={() => setCurrentStep(2)} className="back-btn">
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    className="place-order-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>{formatPrice(cart.tax)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{cart.subtotal > 50 ? 'FREE' : '$9.99'}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(cart.total + (cart.subtotal > 50 ? 0 : 9.99))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
