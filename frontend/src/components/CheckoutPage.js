import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Styles/Checkoutpage.css';
import './Styles/Checkoutpage.css';   
import imgcheck from './checkout.png.png'

import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import logoImage from './Screenshot 2024-11-13 190917.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [mobile, setMobile] = useState('');
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 5 minutes in seconds

  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(''); // Error state declared here
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [description, setDescription] = useState('');

  
  // Handle navigation
  const handleAccountClick = () => navigate('/account');
  const handleCartClick = () => navigate('/cart');

  // Fetch cart data from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Fetch user data based on mobile session
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
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Something went wrong while fetching user data.');
    }
  };

  // Calculate total cost from cart items
  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.unitPrice * (item.quantity || 1), 0);
  }, [cart]);

  const fetchQrCode = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generate-qr?amount=${calculateTotal()}`);
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode); // QR Code URL
        setTransactionRef(data.transactionRef); // Transaction reference (if applicable)
      } else {
        console.error('Failed to fetch QR Code');
      }
    } catch (err) {
      console.error('Error fetching QR Code:', err);
    }
  }, [calculateTotal]);

  useEffect(() => {
    if (cart.length > 0) {
      fetchQrCode();
    }
  }, [cart, fetchQrCode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setScreenshot(file); // Set the file to state
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      setNotification('Your cart is empty.');
      setTimeout(() => setNotification(''), 7000);
      return;
    }

    const orderData = cart.map((item) => ({
      productName: item.name,
      quantity: item.quantity || 1,
      duration: item.duration,
      email: user ? user.email : email, // Use user email or entered email
    }));

    setIsLoading(true);

    try {
      const orderResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/add-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order submission failed:', errorData);
        setNotification('Failed to submit order.');
        setTimeout(() => setNotification(''), 7000);
        return;
      }

      // Prepare email data for sending order confirmation with file
      const formData = new FormData();
      formData.append('email', user ? user.email : email);
      formData.append('utr', utr);
      formData.append('screenshot', screenshot); // Screenshot file to be uploaded to S3
      formData.append('products', JSON.stringify(cart));
      formData.append('mobile', user ? user.mobile : mobile); // Add mobile number
      formData.append('name', user ? user.name : name);       // Add name
      formData.append('description', user ? user.description : description);       // Add name

      const emailResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/send-email`, {
        method: 'POST',
        body: formData,
      });

      if (emailResponse.ok) {
        setNotification('Thank you for buying Your order will be delivered within 30-180 min');
        setTimeout(() => setNotification(''), 7000);  // Show notification for 7 seconds
        localStorage.removeItem('cart'); // Clear cart
        setTimeout(() => {
          navigate('/home'); // Redirect to home page
        }, 4000);      } else {
        const emailError = await emailResponse.json();
        console.error('Email sending failed:', emailError);
        setNotification('Failed to send email. Please try again.');
        setTimeout(() => setNotification(''), 7000);
      }
    } catch (err) {
      console.error('Error processing order:', err);
      setNotification('Please fill all the details ');
      setTimeout(() => setNotification(''), 7000);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the timer when it reaches zero

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleLogoClick = () => {
    navigate('/softwarecity');
  };

  return (
    <>
    <nav className="navbar">
    <div className="hamburger-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        &#9776; {/* Hamburger icon */}
      </div>
    {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
          <div className="mobile-menu-item" onClick={() => navigate('/shop')}>Shop All</div>
          <div className="mobile-menu-item" onClick={() => navigate('/home')}>Home</div>
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

<div className="centered-text">
  <h1>
    <span className="highlight">Checkout</span> Page
  </h1>
  <div className="sketch-line"></div>
</div>
<div className="checkout-container">
{error && <p className="error">{error}</p>}
      <div className="checkout-left">
        <h2 className="greeting">Hello, {user ? user.email : "Guest"}</h2>

        <form onSubmit={handleSubmit} className="checkout-form">
          <label htmlFor="delivery-email" className="form-label">
            Enter billing details:
          </label>
          <input
          placeholder='Enter delivery E-mail '
            type="email"
            id="delivery-email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="utr-number" className="form-label">
            Enter Name:
          </label>
          <input
    placeholder="Enter name"
    type="text"
    id="delivery-name"
    className="form-input"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
  <label htmlFor="utr-number" className="form-label">
            Enter Mobile Number:
          </label>
  <input
    placeholder="Enter Mobile no."
    type="text"
    id="delivery-mobile"
    className="form-input"
    value={mobile}
    onChange={(e) => setMobile(e.target.value)}
    required
  />
   <label htmlFor="utr-number" className="form-label">
            Enter UTR Number:
          </label>
         
          <input
          placeholder='Enter UTR'
            type="text"
            id="utr-number"
            className="form-input"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            required
          />
         
       
         <label htmlFor="utr-number" className="form-label">
         Additional note 
          </label>
      <textarea
        id="description"
        className="form-input"
        placeholder="Enter your additional note "
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="5" // Set the number of rows for the textarea
        cols="40" // Set the number of columns (width)
      />
   
        </form>
       
       
      
      </div>
   
      {/* Right Section */}
      <div className="checkout-right">
      <div className="Discription-icons">
      <img src="https://i1.wp.com/themedemo.commercegurus.com/shoptimizer-demodata/wp-content/uploads/sites/53/2018/07/trust-symbols_a.jpg?resize=1024%2C108&ssl=1" alt="100% Satisfaction Guarantee" />
    
    </div>
    <h3>Order Summary</h3>
{cart.map((item, index) => (
  <div key={index} className="cart-item cartitem2"> {/* Changed from <p> to <div> */}
    <img
      src={item.image || '/placeholder.jpg'}
      alt={item.name || 'Product'}
      className="cart-item-image"
    /> 
    <div>
      {item.name} x {item.quantity} - Rs {item.unitPrice * item.quantity} ({item.duration})
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={`star ${index < 5 ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    </div>
  </div>
))}

<div className="total-price">Total: Rs {calculateTotal()}</div>
{timeLeft > 0 ? (
        <div className="timer">
          <p>Expire with in : {formatTime(timeLeft)}</p>
        </div>
      ) : (
        <div className="timer-expired">
          <p>QR Code expired. Please refresh to get a new one.</p>
        </div>
      )}
        <div className='QR'>
      {/* QR Code Section */}
      {qrCode ? (
        <div className="qr-container">
          <img src={qrCode} alt="QR Code" className="qr-code" />
        </div>
      ) : (
        <div>Loading QR Code...</div>
      )}
     

      {/* Transaction Reference Section */}
      {transactionRef && <div>Transaction Reference: {transactionRef}</div>}  

      {/* File Upload Section */}
      <div className="file-upload-container">
        <label htmlFor="payment-screenshot" className="file-upload-label">
          <div className="upload-box">
            <span className="plus-symbol">+</span>
            <span className="file-name">
              {screenshot ? screenshot.name : "Add Screenshot"}
            </span>
          </div>
        </label>
        <input
          type="file"
          id="payment-screenshot"
          accept="image/*"
          onChange={handleFileChange}
          className="file-upload-input"
          required
        />
      </div>
    </div>
<form onSubmit={handleSubmit} className="utr-form">
         

         
          

         <button
           type="submit"
           className="submit-button submit1"
           disabled={isLoading}
         >
           {isLoading ? "Loading..." : "Submit"}
         </button>
       </form>
<form onSubmit={handleSubmit} className="utr-form">
{notification && (
      <div className="notification">{notification}</div>
    )}
         

         
          

         <button
           type="submit"
           className="submit-button submit2"
           disabled={isLoading}
         >
      
           {isLoading ? "Loading..." : "Submit"}
         </button>
       </form>
        
       
      </div>
    </div>
    <div className="BANNER">
        <img src={imgcheck} alt="PremiumCity Banner" className="banner" />
      </div>
    
    </>

  );
}

export default CheckoutPage;  

