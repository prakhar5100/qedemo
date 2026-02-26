import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Accordion from '../components/Accordion';
import './FAQPage.css';

const FAQPage = () => {
  const breadcrumbItems = [
    { label: 'FAQ', path: null }
  ];

  const shippingFAQs = [
    {
      title: 'What are your shipping options?',
      content: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free standard shipping is available on orders over $50.'
    },
    {
      title: 'Do you ship internationally?',
      content: 'Currently, we only ship within the United States. International shipping is coming soon!'
    },
    {
      title: 'How can I track my order?',
      content: 'Once your order ships, you\'ll receive a tracking number via email. You can also view tracking information in your order history.'
    },
    {
      title: 'What if my package is lost or damaged?',
      content: 'If your package arrives damaged or goes missing, please contact our support team within 48 hours. We\'ll work with the carrier to resolve the issue.'
    }
  ];

  const returnsFAQs = [
    {
      title: 'What is your return policy?',
      content: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Return shipping is free for defective items.'
    },
    {
      title: 'How do I initiate a return?',
      content: 'Log into your account, go to Order History, select the order, and click "Request Return". Follow the instructions to print your return label.'
    },
    {
      title: 'When will I receive my refund?',
      content: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method.'
    },
    {
      title: 'Can I exchange an item?',
      content: 'We don\'t offer direct exchanges. Please return the original item and place a new order for the item you want.'
    }
  ];

  const accountFAQs = [
    {
      title: 'How do I create an account?',
      content: 'Click "Register" in the top navigation, fill out the form with your details, and submit. You\'ll be logged in automatically.'
    },
    {
      title: 'I forgot my password. What should I do?',
      content: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you instructions to reset your password.'
    },
    {
      title: 'Can I change my email address?',
      content: 'Yes! Go to your Profile page and click "Edit" to update your email address and other account information.'
    },
    {
      title: 'How do I delete my account?',
      content: 'Please contact our support team to request account deletion. We\'ll process your request within 48 hours.'
    }
  ];

  const paymentFAQs = [
    {
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay.'
    },
    {
      title: 'Is my payment information secure?',
      content: 'Yes! We use industry-standard encryption (SSL) to protect your payment information. We never store your full credit card number.'
    },
    {
      title: 'Can I use multiple payment methods?',
      content: 'Currently, we only support one payment method per order. You cannot split payment between multiple cards.'
    },
    {
      title: 'Do you offer payment plans?',
      content: 'We partner with Affirm and Klarna to offer installment payment options on orders over $200.'
    }
  ];

  return (
    <div className="faq-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>Frequently Asked Questions</h1>
        <p className="faq-subtitle">Find answers to common questions about ShopSphere</p>

        <div className="faq-sections">
          <section className="faq-section" id="shipping-faq">
            <h2>Shipping & Delivery</h2>
            <Accordion items={shippingFAQs} />
          </section>

          <section className="faq-section" id="returns-faq">
            <h2>Returns & Refunds</h2>
            <Accordion items={returnsFAQs} />
          </section>

          <section className="faq-section" id="account-faq">
            <h2>Account & Profile</h2>
            <Accordion items={accountFAQs} />
          </section>

          <section className="faq-section" id="payment-faq">
            <h2>Payment & Billing</h2>
            <Accordion items={paymentFAQs} />
          </section>
        </div>

        <div className="faq-contact">
          <h2>Still have questions?</h2>
          <p>Can't find the answer you're looking for? Our support team is here to help.</p>
          <a href="/contact" className="contact-btn">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
