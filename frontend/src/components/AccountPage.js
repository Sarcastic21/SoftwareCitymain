// AccountPage.js
import React, { useState,useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logoImage from './Screenshot 2024-11-13 190917.png';
import './Styles/Account.css';
function AccountPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for the menu
  const hamburgerRef = useRef(null); // Reference for the hamburger icon

  const handleClickOutside = (event) => {
    // Check if the click is outside the menu and hamburger icon
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMobileMenuOpen(false); // Close the menu
      // Close the menu
    }
  };
 
  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.email) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/orders?email=${user.email}`);

          const data = await response.json();
          if (response.ok) {
            setOrders(data); // Save orders in state
          } else {
            console.error('Failed to fetch orders:', data.message);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };
  
    fetchOrders();
  }, [user]);
  // Check if the user is logged in on page load
  useEffect(() => {
    const mobile = sessionStorage.getItem('mobile');
    if (mobile) {
      fetchUserData(mobile);
    }
  }, []);

  const fetchUserData = async (mobile) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/mobile/${mobile}`);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setError('User not found. Please log in.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong while fetching user data.');
    }
  };

 
  const handleAccountClick = () => {
    navigate('/account');
  };
  
  const handleCartClick = () => {
    navigate('/cart');
  };
  const handleNavigateToSignup = () => {
    navigate('/login');
  };
 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('mobile');
    setUser(null);
    setError('');
    navigate('/'); // Redirect to home
  };

  const handleLogoClick = () => {
    navigate('/softwarecity');
  };
  return (
    <>
      <div className="home-page">
      <nav className="navbar">
      <div className="hamburger-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} ref={hamburgerRef}  >
        &#9776; {/* Hamburger icon */}
      </div>
    {isMobileMenuOpen && (
        <div ref={menuRef} className="mobile-menu">
          <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
          <div className="mobile-menu-item" onClick={() => navigate('/shop')}>Shop All</div>
          <div className="mobile-menu-item" onClick={() => navigate('/home')}>Home</div>
          <div className="mobile-menu-item" onClick={() => navigate('/games')}>Games</div>

          <div className="mobile-menu-item" onClick={() => navigate('/adult')}>Adult 18+</div>
          <div className="mobile-menu-item" onClick={() => navigate('/entertainment')}>Entertainment</div>
          <div className="mobile-menu-item" onClick={() => navigate('/cracked')}>Cracked</div>
          <div className="mobile-menu-item" onClick={() => navigate('/international')}>International</div>
          <div className="mobile-menu-item" onClick={() => navigate('/private')}>Private</div>
          <div className="mobile-menu-item" onClick={() => navigate('/productivity')}>Productivity</div>
          <div className="mobile-menu-item" onClick={() => navigate('/account')}>Account Details</div>
          <div className="mobile-menu-item" onClick={() => navigate('/orders')}>Orders</div>
          <div className="mobile-menu-item" onClick={() => navigate('/cart')}>Cart</div>
          <div className="mobile-menu-item" onClick={() => navigate('/about')}>About Us</div>
          <div className="mobile-menu-item" onClick={() => navigate('/contact')}>Contact Us</div>
        </div>
      )}
      {/* Logo placeholder */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
      <img src={logoImage} alt="PremiumCity Logo" className="logo-image" />
    </div>
      {/* Other navbar elements, e.g., search bar, account, and cart buttons */}
    

      {/* Search bar */}
   

      {/* Account and Cart icons */}
      <div className="navbar-buttons">
      <button className="navbar-button acc" onClick={handleAccountClick}>
          <FaUserCircle className='icon' /> My Account
        </button>
        <button className="navbar-button" onClick={handleCartClick}>
          <FaShoppingCart className='icon' />({JSON.parse(localStorage.getItem('cart'))?.length || 0}) 
        </button>
        
      </div>
    </nav>
    <div className="premium-navbar">
    <div className='mobile'>
      <div className='mobilebutton'  onClick={() => navigate('/softwarecity')}>
      Software City

      </div>
      <div className='acc4' onClick={() => navigate('/shop')}>
        Shop All

      </div>
      <div className='acc4' onClick={() => navigate('/games')}>
         Games
        </div>

      </div>


    

      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <div className="navbar-item" onClick={() => navigate('/shop')}>Shop All</div>

        {/* Category Dropdown */}
        <div className="navbar-item dropdown">
          Category <span className="arrow">&#x25BC;</span>
          <div className="dropdown-content">
            <button className="dropdown-button" onClick={() => navigate('/home')}>Home</button>
            <button className="dropdown-button" onClick={() => navigate('/games')}>Games</button>

            <button className="dropdown-button" onClick={() => navigate('/adult')}>Adult 18+</button>
            <button className="dropdown-button" onClick={() => navigate('/entertainment')}>Entertainment</button>
            <button className="dropdown-button" onClick={() => navigate('/cracked')}>Cracked</button>
            <button className="dropdown-button" onClick={() => navigate('/international')}>International</button>
            <button className="dropdown-button" onClick={() => navigate('/private')}>Private</button>
            <button className="dropdown-button" onClick={() => navigate('/productivity')}>Productivity</button>
          </div>
        </div>
        <div className="navbar-item" onClick={() => navigate('/games')}>Games</div>

        {/* My Account Dropdown */}
        <div className="navbar-item dropdown">
          My Account
          <div className="dropdown-content">
            <button className="dropdown-button" onClick={() => navigate('/account')}>Account Details</button>
            <button className="dropdown-button" onClick={() => navigate('/orders')}>Orders</button>
            <button className="dropdown-button" onClick={() => navigate('/cart')}>Cart</button>
          </div>
        </div>

        {/* Additional Links */}
        <div className="navbar-item" onClick={() => navigate('/about')}>About Us</div>
        <div className="navbar-item" onClick={() => navigate('/contact')}>Contact Us</div>
      </div>

      {/* Mobile Sliding Menu */}
    
    </div>
   <div className="whatsapp-community">
    <FontAwesomeIcon icon={faTelegram} size="1x" color="Grey" />

    <h6>Join our Telegram Channel</h6>
    <Link href="https://t.me/YOUR_GROUP_LINK" target="_blank" className="telegram-link">
Join now
</Link>
</div>
</div>
<div className="account-page">
      <div className="account-header">
      <div className="centered-text">
  <h1>
    <span className="highlight">Account</span> Details
  </h1>
  <div className="sketch-line"></div>
    
      </div>
      </div>

      <div className="account-container">
      <div className="nav-links2">
            <div className={`nav-btn2 ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('dashboard')}>Dashboard</div>
            <div className={`nav-btn2 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => handleTabClick('orders')}>Orders</div>
            <div className={`nav-btn2 ${activeTab === 'downloads' ? 'active' : ''}`} onClick={() => handleTabClick('downloads')}>Downloads</div>
            <div className={`nav-btn2 ${activeTab === 'address' ? 'active' : ''}`} onClick={() => handleTabClick('address')}>Address</div>
            <div className={`nav-btn2 ${activeTab === 'account-details' ? 'active' : ''}`} onClick={() => handleTabClick('account-details')}>Account Details</div>
            <button className="nav-btn"  onClick={handleLogout}> {error && <p style={{ color: 'red' }}>{error}</p>}Logout</button>
        </div>
        {/* Left Side Navigation */}
        <div className="sidebar">
        
          <div className="nav-links">
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('dashboard')}>Dashboard</button>
            <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => handleTabClick('orders')}>Orders</button>
            <button className={`nav-btn ${activeTab === 'downloads' ? 'active' : ''}`} onClick={() => handleTabClick('downloads')}>Downloads</button>
            <button className={`nav-btn ${activeTab === 'address' ? 'active' : ''}`} onClick={() => handleTabClick('address')}>Address</button>
            <button className={`nav-btn ${activeTab === 'account-details' ? 'active' : ''}`} onClick={() => handleTabClick('account-details')}>Account Details</button>
            <button className="nav-btn" onClick={handleLogout}> {error && <p style={{ color: 'red' }}>{error}</p>}Logout</button>
          </div>
        </div>
        
         

        {/* Right Side Content */}
        <div className="main-content">
  {activeTab === 'dashboard' && (
    <div className="dashboard-content">
      <h2>Hello, {user ? user.email : "Guest"}</h2>
      <p>From your Dashboard, you can view your orders, address, and reset your password.</p>

      {/* Render Signup Button only if the user is not logged in */}
      {!user && (
        <div className="signup-section">
          <p>
            Don't have an account?{" "}
            <button onClick={handleNavigateToSignup} className="signup-btn">
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  )}

          {activeTab === 'orders' && (
            <div className="orders-content">
            <div>
      <h2>Hello, {user ? user.email : "Guest"}</h2>
      <div>
        <h3>Order Section</h3>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order, index) => (
              <li key={index}>
                <p>Product Name: {order.productName}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Duration: {order.duration}</p>
                <p>Ordered On: {new Date(order.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="downloads-content">
              <h2>Downloads</h2>
              <p>No Downloads available now.</p>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="address-content">
              <h2>Your Address</h2>
              <p>Address details will be displayed here later.</p>
            </div>
          )}

{activeTab === 'account-details' && (
  <div className="account-details-content">
    <h2>Account Details</h2>
    {user ? (
      <>
        <p>Email: {user.email}</p>
        <p>Phone Number: {user.mobile}</p>
      </>
    ) : (
      <p>No account details available. Please log in.</p>
    )}
  </div>
)}
</div>
</div>

      {/* Social Media and Contact Us Section */}
  <div className="contact-info">
  <h3>Contact Us</h3>
  <div className="social-icons">
    {/* Telegram */}
    <a
      href="https://t.me/YourTelegramHandle"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faTelegram} size="2x" />
    </a>

    {/* Email */}
    <a href="mailto:yourmail@example.com">
      <FontAwesomeIcon icon={faEnvelope} size="2x" />
    </a>
  </div>
</div>

      </div>
     
    </>
  );
}

export default AccountPage;
