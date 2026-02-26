import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './AboutPage.css';

const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'About Us', path: null }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <section className="about-hero" id="our-story">
          <h1>About ShopSphere</h1>
          <p className="subtitle">Your trusted online shopping destination</p>
        </section>

        <section className="about-section" id="our-story">
          <h2>Our Story</h2>
          <p>
            ShopSphere was founded in 2020 with a simple mission: to make online shopping 
            easy, enjoyable, and accessible to everyone. We believe that quality products 
            should be available to all, which is why we work tirelessly to curate the best 
            selection of electronics, apparel, and home goods.
          </p>
          <p>
            Our platform brings together thousands of products from trusted brands, all in 
            one convenient location. Whether you're looking for the latest tech gadget, 
            comfortable clothing, or home essentials, ShopSphere has you covered.
          </p>
        </section>

        <section className="about-section" id="team">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-avatar">JD</div>
              <h3>John Doe</h3>
              <p className="team-role">CEO & Founder</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">JS</div>
              <h3>Jane Smith</h3>
              <p className="team-role">Chief Technology Officer</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">BW</div>
              <h3>Bob Wilson</h3>
              <p className="team-role">Head of Operations</p>
            </div>
            <div className="team-member">
              <div className="team-avatar">SD</div>
              <h3>Sarah Davis</h3>
              <p className="team-role">Customer Success Lead</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🎯 Customer First</h3>
              <p>Your satisfaction is our top priority. We're here to serve you.</p>
            </div>
            <div className="value-card">
              <h3>✨ Quality Products</h3>
              <p>We only offer products that meet our high standards.</p>
            </div>
            <div className="value-card">
              <h3>🚀 Innovation</h3>
              <p>We constantly improve to provide the best shopping experience.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Trust & Transparency</h3>
              <p>Honest pricing, clear policies, and reliable service.</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions or feedback? We'd love to hear from you!
          </p>
          <Link to="/contact" className="contact-cta">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
