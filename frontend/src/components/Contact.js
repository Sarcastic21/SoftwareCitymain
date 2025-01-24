import React, { useState,useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Styles/Contact.css';

import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import './Styles/PremiumCity.css';
import logoImage from './Screenshot 2024-11-13 190917.png';
import img22 from './Contact2.png'
import img21 from './Screenshot 2024-11-13 205657.png'
import { FaTelegram, FaEnvelope } from "react-icons/fa";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import imgabout from './Forabout.png'

const faqs = [
  {
    question: "How to buy a subscription?",
    answer: `
      Step 1: Select your favorite subscription from the store.
      Step 2: Add subscription to the cart and proceed to checkout.
      Step 3: Fill in your details & create a new username & password.
      Step 4: Select your preferred payment gateway and complete your payment.
      Step 5: Your subscription will be delivered to your registered email in 30-180min (up to 8Hr).
    `,
  },
  {
    question: "Are these subscriptions Real and Safe to use?",
    answer:
      "YES, all subscriptions we provide are 100% genuine and safe to use. Always read the subscription’s full description to know everything about it.",
  },
  {
    question: "How is my data protected?",
    answer:
      "All user information is 128-bit SSL encrypted, meaning your name, email, phone number, and everything else are encrypted and no one can ever access it, not even us!",
  },
  {
    question: "How do I track the status of my order?",
    answer: "Just click on the 'Track Order' button at the top of the website.",
  },
  {
    question: "How do I receive customer support?",
    answer:
      "Just click on the 'Chat Now' button. You can also message us on WhatsApp support.",
  },
  {
    question: "What if my subscription stops working?",
    answer:
      "Every subscription has a replacement warranty period under which it is replaceable without any issue. Just contact us with your Order ID and we will do the rest.",
  },
  {
    question: "What if I don’t get my subscription after checkout?",
    answer:
      "Usually, we process all orders within 30-180min, but sometimes it may take up to 8Hr, and in rare cases up to 24Hr. Feel free to contact us if your subscription is not delivered in 8Hr.",
  },
  {
    question: "I am new here and can't believe these offers and discounts!",
    answer:
      "It's natural to doubt our insane discounts. Here are some facts that might help: We have served 6500+ users since 2017 with a 4.8/5 average customer satisfaction rating.",
  },
];




export default function Contact() {
    const navigate = useNavigate();
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notification, setNotification] = useState('');
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
  
   
    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
      };


      const fetchTopRatedProducts = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/top-rated-products`);
          if (response.ok) {
            const data = await response.json();
            setTopRatedProducts(data.slice(0, 10));
            setLoading(false);
          } else {
            console.error('Failed to fetch top-rated products:', response.statusText);
            alert('Failed to fetch top-rated products');
          }
        } catch (error) {
          console.error('Error fetching top-rated products:', error);
          alert('Error fetching top-rated products: ' + error.message);
        }
      };
      
      useEffect(() => {
        fetchTopRatedProducts(); // Fetch the top-rated products when the component mounts
      }, []);

    
  
 
   
    const addToCart = (product, selectedPrice, selectedDuration) => {
      // Define the cart item with unitPrice and price
      const cartItem = {
        _id: product._id,
        name: product.name,
        image: product.image,
        MRP: product.MRP,
        unitPrice: selectedPrice, // Dynamically selected unit price
        price: selectedPrice, // Initial total price (unitPrice * 1, assuming quantity starts at 1)
        duration: selectedDuration, // Dynamically selected duration
        quantity: 1, // Initial quantity
      };
    
      console.log('Added to Cart:', cartItem);
    
      // Retrieve the existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
      // Check if the item already exists in the cart
      const existingItem = existingCart.find((item) => item._id === product._id && item.duration === selectedDuration);
    
      if (existingItem) {
        // If the item exists, update the quantity and total price
        const updatedCart = existingCart.map((item) =>
          item._id === product._id && item.duration === selectedDuration
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                price: item.unitPrice * (item.quantity + 1) // Recalculate price based on new quantity
              }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setNotification(` added to cart!`);
        setTimeout(() => {
          setNotification('');
        }, 1000);
       } else {
         // If the item does not exist, add it to the cart
         const updatedCart = [...existingCart, cartItem];
         localStorage.setItem('cart', JSON.stringify(updatedCart));
        setNotification(` quantity updated in cart!`);
        setTimeout(() => {
          setNotification('');
        }, 1000);
       }
     };
    const goToProductDetail = (productId) => {
      navigate(`/product/${productId}`);
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
<div className="BANNER">
        <img src={img22} alt="PremiumCity Banner" className="banner" />
      </div>
      <div className="centered-text">
      <h1>
    <span className="highlight">Contact</span> Us
  </h1>
  <div className="sketch-line"></div>
  <div className="centered-text">
        <img src={img21} alt="Shop" className="shop" />
      </div>
      <div className="contact-container">
  {/* Telegram Section */}
  <div className="contact-card">
    <FaTelegram className="contact-icon telegram" />
    <h3>Connect with us on Telegram for instant assistance.</h3>
    <button
      className="contact-button"
      onClick={() => window.open("https://t.me/YourTelegramHandle", "_blank")}
    >
      Go to Telegram
    </button>
  </div>

  {/* Email Section */}
  <div className="contact-card">
    <FaEnvelope className="contact-icon email" />
    <h3>Our team is here to help you with any technical issues.</h3>
    <button
      className="contact-button"
      onClick={() => (window.location.href = "mailto:yourmail@example.com")}
    >
      Send Email
    </button>
  </div>
</div>

</div>
      <div className="centered-text">
      <h1>
    <span className="highlight">Our Journey </span> Begin in 2024
  </h1>
  <div className="sketch-line"></div>
  <div className="centered-text">
        <img src={img21} alt="Shop" className="shop" />
      </div>
      <h3>We have started our journey in 2024 , and still we love to provide you our service.</h3>
</div>
      <div className="centered-text">
  <h1>
    <span className="highlight">Oour Popular</span> Picks
  </h1>
  <div className="sketch-line"></div>
</div>
<div className='Top-rated-products'>
  {loading ? (
    <p>Loading...</p>
  ) : (
    <div className="product-grid">
      {topRatedProducts.length > 0 ? (
        topRatedProducts.map((product) => {
          // Function to get the available price and duration
          const getSelectedPriceAndDuration = (prices) => {
            if (prices.oneMonth) return { price: prices.oneMonth, duration: '1 Month' };
            if (prices.threeMonths) return { price: prices.threeMonths, duration: '3 Months' };
            if (prices.sixMonths) return { price: prices.sixMonths, duration: '6 Months' };
            if (prices.twelveMonths) return { price: prices.twelveMonths, duration: '12 Months' };
            if (prices.game) return { price: prices.game, duration: 'Lifetime' };

            return { price: 0, duration: 'Unavailable' }; // Default if no price is provided
          };

          // Get the price and duration dynamically
          const { price: selectedPrice, duration: selectedDuration } = getSelectedPriceAndDuration(product.prices);

          // Calculate discount
          const discount = product.MRP && selectedPrice
            ? Math.round(((product.MRP - selectedPrice) / product.MRP) * 100)
            : 0;

          return (
            <div  key={product._id}
            className="product-card"
            onClick={() => goToProductDetail(product._id)} >
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="discount-badge">{discount}%</div>
              )}

              {/* Product Image */}
              <img className="product-image"  src={product.image} alt={product.name} />

              <div className="product-details3">
                <h3>{product.name}</h3>

                {/* Star Rating */}
                <div className="st1">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={`st ${index < 5 ? 'filled' : ''}`}>★</span>
                  ))}
                </div>

                {/* Pricing Section */}
                <div className="price-details">
              <span className="mrp">₹{product.MRP}</span>
              <span className="selected-price">₹{selectedPrice}</span>
            </div>

                {/* Add to Cart and Select Options Buttons */}
                <div className="action-button">
  {product.showSelectOptions ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        goToProductDetail(product._id);
      }}
    >
      Select Options
    </button>
  ) : (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        if (product.outOfStock) {
          alert('This product is out of stock.');
          return;
        }
        addToCart(product, selectedPrice, selectedDuration);
      }}
      disabled={product.outOfStock}
    > {notification && (
      <div className="notification">{notification}</div>
    )}
      {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )}
  
</div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No top-rated products found.</p>
      )}
    </div>
  )}
</div>
<div>
            <button className="dropdown-button-load" onClick={() => navigate('/home')}>Load More</button>
          
</div>


    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-columns">
        <div className="faq-column">
          {faqs.slice(0, 4).map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">{faq.question}</div>
              <div className="faq-answer">
                {activeIndex === index && <p>{faq.answer}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="faq-column">
          {faqs.slice(4).map((faq, index) => (
            <div
              key={index + 4}
              className={`faq-item ${activeIndex === index + 4 ? "active" : ""}`}
              onClick={() => toggleFAQ(index + 4)}
            >
              <div className="faq-question">{faq.question}</div>
              <div className="faq-answer">
                {activeIndex === index + 4 && <p>{faq.answer}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

<div className="centered-text">
 
  <div className="ott-section">
      <div className="ott-content">
        <div className="ott-images">
        <img src={imgabout} alt="PremiumCity Logo" className="tablet-image" />

         
        </div>
        <div className="ott-text">
          <h3>A PERFECT FIT FOR YOUR EVERY DAY LIFE</h3>
          <h2><span className="highlight">Wide</span> Range of OTT Subscription</h2>
          <p>Over-the-top media services (OTT) platforms have become quite popular in India since the last few years. An over-the-top (OTT) media service is a streaming media service offered directly to viewers via the internet. bypasses cable, broadcast, and satellite television platforms, the companies that traditionally act as a controller or distributor of such content. Due to COVID-19 outbreak in the country, many filmmakers are now releasing their movies on major OTT platforms, instead of waiting for the theatres to re-open.</p>
        </div>
      </div>
    </div>
    <div className="carousel-container">
    <div className="centered-text">
 
      </div>
    </div>

</div>

    
 

    </>
  )
}
