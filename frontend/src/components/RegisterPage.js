import React, { useState, useRef,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logoImage from './Screenshot 2024-11-13 190917.png';
import img21 from './Screenshot 2024-11-13 205657.png'

function RegisterPage() {
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteSport, setFavoriteSport] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    email: "user@example.com",
    mobile: "1234567890",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for the menu
  const hamburgerRef = useRef(null);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mobile, password, favoriteSport }),
      });

      const data = await response.json();
      if (response.status === 201) {
        alert(data.message);
        window.location.href = '/login'; // Redirect to login page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
    }
  };
  const handleAccountClick = () => {
    navigate('/account');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

 
  const handleLogout = () => {
    sessionStorage.removeItem('mobile');
    setUser(null);
    setError('');
    navigate('/'); // Redirect to home
  };
 
 
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
  <div className="centered-text">
        <img src={img21} alt="Shop" className="shop" />
      </div>     
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
            <button className="nav-btn"  onClick={handleLogout}> {error && <p style={{ color: 'red' }}>{error}</p>}Logout</button>
          </div>
        </div>
        
        <div className="main-content">
     {activeTab === 'dashboard' && (

     <div className="login-container">  
            <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Favorite Sport"
          value={favoriteSport}
          onChange={(e) => setFavoriteSport(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
        )}
        
       

{activeTab === 'orders' && (
            <div className="orders-content">
              <h2>Your Orders</h2>
              <p>No orders yet.</p>
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
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.mobile}</p>
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

export default RegisterPage;
