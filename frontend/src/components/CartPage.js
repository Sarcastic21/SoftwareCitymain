import React, { useState,useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import logoImage from './Screenshot 2024-11-13 190917.png';
import './Styles/Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
function CartPage() {
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();
  const [notification, setNotification] = useState('');
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
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);
  const handleContinueShopping = () => {
    navigate("/home"); // Navigate to the home page
  };
  const removeFromCart = (itemToRemove) => {
    const updatedCart = cart.filter(item => item._id !== itemToRemove._id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showNotification('Item removed from cart.'); // Show notification when an item is removed
  };
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative or zero quantity

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            price: item.unitPrice * newQuantity, // Dynamically update price based on quantity
          };
        }
        return item;
      });

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.unitPrice * (item.quantity || 1), 0);


  const handleCheckout = () => {
    // Simply navigate to the checkout page without checking login status
    navigate('/checkout');
  };
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 1000); // Automatically hide the notification after 1 second
  };
  const handleAccountClick = () => {
    navigate('/account');
  };

  const handleCartClick = () => {
    navigate('/cart');
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
<div className="cart-container">
  {notification && <div className="notification">{notification}</div>} {/* Display notification */}

  <div className="cart-header">
    <h1>Shopping Cart</h1>
    <button className="continue-shopping-btn" onClick={handleContinueShopping}>
      Continue shopping
    </button>
  </div>

  {cart.length === 0 ? (
    <div className="empty-cart">
      <p>Your cart is empty.</p>
    </div>
  ) : (
    <div className="cart-content">
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={item.image || '/placeholder.jpg'}
              alt={item.name || 'Product'}
              className="cart-item-image"
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Selected Duration: {item.duration || '1 Month'}</p>
              <p>
                Price: ₹{(item.unitPrice * (item.quantity || 1)).toFixed(2)}
              </p>
              <div className="quantity-control">
  {/* Check if the product category is not "Games" to display the quantity controls */}
  {item.duration !== 'Lifetime' && (
    <>
      <button 
        onClick={() => updateQuantity(item._id, Math.max((item.quantity || 1) - 1, 1))}
      >
        -
      </button>
      <input
        type="number"
        min="1"
        value={item.quantity || 1}
        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
      />
      <button 
        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
      >
        +
      </button>
    </>
  )}
</div>

              <button className="remove-item-btn" onClick={() => removeFromCart(item)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-details">
        <h3 className="price1"> Sub Total Price: ₹{calculateTotal().toFixed(2)}</h3>
        <h3 className="price1">Total Price: ₹{calculateTotal().toFixed(2)}</h3>
          </div>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )}
</div>


    </>
  );
}

export default CartPage;
