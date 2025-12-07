import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Intare Pharmacy</h3>
            <p>Your trusted partner in healthcare</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 +250 788462227</p>
            <p>📧 info@intarepharmacy.com</p>
          </div>
          <div className="footer-section">
            <h4>Hours</h4>
            <p>Mon-Fri: 8AM-8PM</p>
            <p>Sat-Sun: 9AM-6PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Intare Pharmacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;