// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLocationArrow, FaArrowLeft, FaArrowRight, FaGlobe, FaLock } from "react-icons/fa";
import BEST from './Screenshot 2024-12-08 172017.png'

export default function Footer() {
  return (
    <>
    <div className="features-grid">
      <div className="feature">
      <FaLocationArrow className="icon" />

        <h3>Delivery on Email</h3>
        <p>Get Your Purchase Details on Email.</p>
      </div>
      <div className="feature">
      <FaArrowLeft className="icon" />
      <FaArrowRight className="icon" />

        <h3>Includes Free Warranty</h3>
        <p>Comes with replacement warranty.</p>
      </div>
      <div className="feature">
      <FaGlobe className="icon" />

        <h3>All Over Globe</h3>
        <p>Service all over the world.</p>
      </div>
      <div className="feature secure-checkout">
      <FaLock className="icon" />

        <h3>Guaranteed Secure Checkout</h3>
        <p>Paytm / UPI / PayPal </p>
        
      </div>
    </div>
    <footer>
    <div className="footer-container acc3">
    <div className="footer-section">
        <h3>Store Links</h3>
        <ul>
      <li>
        <Link to="/account">My Account</Link>
      </li>
      <li>
        <Link to="/contact">Contact Us</Link>
      </li>
      <li>
        <Link to="/privacy-policy">Privacy & Policy</Link>
      </li>
      <li>
        <Link to="/terms-and-conditions">Terms and Conditions</Link>
      </li>
      <li>
        <Link to="/contact">FAQ</Link>
      </li>
    </ul>
      </div>
      <div className="footer-section acc3">
        <h3>About Us</h3>
        <p>The Most Trusted Premium Service Provider (PSP) brings up a wide range of Premium Accounts across the web that proudly powered and managed by Our TEAM Members since 2024.</p>
        <p>Email or Chat with us for any assistance.</p>
      </div>
      
      <div className="BANNER">
      <img src={BEST} alt="PremiumCity Banner" className="banner" />

      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024-25 Software City</p>
    </div>
  </footer>
  </>
  );
}
