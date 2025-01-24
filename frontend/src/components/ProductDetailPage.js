import React, { useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import {  FaShoppingCart } from 'react-icons/fa';
import logoImage from './Screenshot 2024-11-13 190917.png';
import './Styles/ProductDetail.css';
import img21 from './Screenshot 2024-11-13 205657.png'
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
function ProductDetailPage() {
  
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState([]);

  const [visibleReviews, setVisibleReviews] = useState(6);
  const [selectedDurationKey, setSelectedDurationKey] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const fetchRelatedProducts = useCallback(async (category) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/products?category=${category}`);

      const data = await response.json();
      const filteredProducts = data.filter((p) => p._id !== id);
      setRelatedProducts(filteredProducts.slice(0, 6)); // Show up to 4 related products
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }, [id]); // Dependency on 'id'

  // Function to fetch product details
  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${id}`);

      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();

      setProduct(data);

      // Find the first available price key dynamically
      const firstAvailableKey = Object.keys(data.prices).find((key) => data.prices[key]);
      if (firstAvailableKey) {
        setSelectedDurationKey(firstAvailableKey);
        setSelectedPrice(data.prices[firstAvailableKey]);
      } else {
        setSelectedPrice('0');
      }

      // Fetch related products by category
      fetchRelatedProducts(data.category);
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Error fetching product details.');
    } finally {
      setLoading(false);
    }
  }, [id, fetchRelatedProducts]); // Dependencies

  // useEffect to fetch product details
  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // useEffect to call fetchProductDetails
  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);
  // Initialize helpful counts with each review's ID as keys, defaulting to 0 if undefined
  const [helpfulCounts, setHelpfulCounts] = useState(
    reviews.reduce((acc, review) => {
      acc[review._id] = Number(review.helpful) || 0; // Coerce to number, default to 0
      return acc;
    }, {})
  );
  const calculateAverageRating = (reviews) => {
    const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalStars / reviews.length).toFixed(1);
  };
  
  const scrollToSection = (className) => {
    const section = document.querySelector(`.${className}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  // Example usage:
  
  const averageRating = calculateAverageRating(reviews);

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 6);
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulCounts((prevCounts) => ({
      ...prevCounts,
      [reviewId]: (prevCounts[reviewId] || 0) + 1,
    }));
  };

  // Submit review
  const submitReview = async () => {
    const reviewData = { id, name, comment, rating };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/submit`,{

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (data.message === 'Review submitted successfully') {
        // Fetch updated reviews after successful submission
        fetchReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/forProduct/${id}`);

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  }, [id]); // id is a dependency here
  
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

 
  const handlePriceChange = (e) => {
    const priceKey = e.target.value;
    const price = product.prices[priceKey] || selectedPrice; // Use the selected price or fallback
    setSelectedDurationKey(priceKey);
    setSelectedPrice(price);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      setQuantity(newQuantity); // Update quantity only if it's greater than 0
    }
  };
  const addToCart = (product, selectedDurationKey) => {
    const selectedPrice = product.prices[selectedDurationKey];
    const durationLabels = {
      oneMonth: '1 Month',
      threeMonths: '3 Months',
      sixMonths: '6 Months',
      twelveMonths: '12 Months',
      game: 'Lifetime',
    };
  
    // Create the cart item
    const cartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      unitPrice: selectedPrice, // Unit price
      price: selectedPrice, // Initial total price
      duration: durationLabels[selectedDurationKey] || selectedDurationKey,
      quantity: 1, // Fixed quantity
    };
  
    // Retrieve the existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the item already exists in the cart
    const existingItem = existingCart.find(
      (item) => item._id === product._id && item.duration === durationLabels[selectedDurationKey]
    );
  
    if (existingItem) {
      // Notify the user that the item is already in the cart
      setNotification(`${product.name} with duration ${cartItem.duration} is already in the cart!`);
      setTimeout(() => {
        setNotification('');
      }, 1000);
    } else {
      // Add the item to the cart if it does not exist
      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setNotification(`${product.name} added to the cart!`);
      setTimeout(() => {
        setNotification('');
      }, 1000);
    }
  };
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 1000);
  };
  
  const addToCart2 = (product, selectedPrice, selectedDuration) => {
    // Create a cart item with unit price and total price
    const cartItem2 = {
      _id: product._id,
      name: product.name,
      image: product.image,
      MRP: product.MRP,
      unitPrice: selectedPrice, // Unit price of the product
      price: selectedPrice, // Total price for 1 quantity
      duration: selectedDuration, // Selected duration
      quantity: 1, // Fixed quantity of 1
    };
  
    console.log('Added to Cart:', cartItem2);
  
    // Retrieve existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Check if the item already exists in the cart
    const existingItem = existingCart.find(
      (item) => item._id === product._id && item.duration === selectedDuration
    );
  
    if (existingItem) {
      // If the product already exists, show a notification (no updates to quantity/price)
      showNotification(`${product.name} with duration ${selectedDuration} is already in the cart!`);
    } else {
      // Add the new product to the cart
      const updatedCart = [...existingCart, cartItem2];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      showNotification(`${product.name} added to cart!`);
    }
  };
  
  

  const handleBuyClick = (product, selectedDurationKey) => {
    const selectedPrice = product.prices[selectedDurationKey];
    const durationLabels = {
      oneMonth: '1 Month',
      threeMonths: '3 Months',
      sixMonths: '6 Months',
      twelveMonths: '12 Months',
     game:'Lifetime'
    };
  
    // Create cart item with unit price and quantity
    const cartItem3 = {
      _id: product._id,
      name: product.name,
      image: product.image,
      unitPrice: selectedPrice, // Add unit price
      price: selectedPrice * quantity, // Total price (unit price * quantity)
      duration: durationLabels[selectedDurationKey] || selectedDurationKey,
      quantity,
    };
  
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = existingCart.find(
      (item) => item._id === product._id && item.duration === durationLabels[selectedDurationKey]
    );
  
    if (existingItem) {
      // If the item already exists in the cart, update its quantity and total price
      const updatedCart = existingCart.map((item) =>
        item._id === product._id && item.duration === durationLabels[selectedDurationKey]
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              price: item.unitPrice * (item.quantity + quantity), // Update total price based on new quantity
            }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // If the item doesn't exist in the cart, add it as a new item
      const updatedCart = [...existingCart, cartItem3];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  

  // Redirect to the checkout page
  setTimeout(() => {
    navigate('/checkout');
  }, 1000); // Add a slight delay to allow the notification to show
};

// Calculate the discount based only on MRP (first price in the range)
// Safeguard calculations with checks
const baseMRP = product?.MRP || 0; // Default to 0 if not available
const secondaryMRP = product?.MRP2 || 0; // Default to 0 if not available

// Calculate discount based on the first price only
const discount = 
  baseMRP && selectedPrice
    ? Math.round(((baseMRP - selectedPrice) / baseMRP) * 100)
    : 0;

// Calculate total price (based only on baseMRP and quantity)
const discountedTotal = selectedPrice ? selectedPrice * quantity : 0;

  const goToProductDetail = (id) => {
    navigate(`/product/${id}`);
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
  
  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;
  
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

<div className="section Product-full-detail">
       

        
  <img src={product.image} alt={product.name} className="product-image99" />
  <div className="product-details">
      {/* Product Name */}
      <h2>{product?.name || 'Product not found'}</h2>

      {/* Product Description */}
      <p className="d">
        {product?.description?.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>

      {/* Star Ratings */}
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < averageRating ? 'star-filled' : 'star-empty'}`}
          >
            ★
          </span>
        ))}
        <span className="average-rating"> {averageRating}</span>
      </div>

      {/* Duration Selector and Input Options */}
      <div className="div2">
        {/* Only show these if product category isn't Games */}
        {product?.category !== 'Games' && (
          <>
            <label>Duration: </label>
            <select
              id="duration"
              onChange={handlePriceChange}
              value={selectedDurationKey}
            >
              {product?.prices?.oneMonth && (
                <option value="oneMonth">1 Month - ₹{product.prices.oneMonth}</option>
              )}
              {product?.prices?.threeMonths ? (
                <option value="threeMonths">3 Months - ₹{product.prices.threeMonths}</option>
              ) : (
                <option value="threeMonths" disabled>
                  3 Months - Not Available
                </option>
              )}
              {product?.prices?.sixMonths ? (
                <option value="sixMonths">6 Months - ₹{product.prices.sixMonths}</option>
              ) : (
                <option value="sixMonths" disabled>
                  6 Months - Not Available
                </option>
              )}
              {product?.prices?.twelveMonths ? (
                <option value="twelveMonths">12 Months - ₹{product.prices.twelveMonths}</option>
              ) : (
                <option value="twelveMonths" disabled>
                  12 Months - Not Available
                </option>
              )}
            </select>
            <input
              className="Quantity"
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </>
        )}
      </div>

      <div className="price-details">
  <div className="mrp x1">
    ₹{baseMRP}
    {secondaryMRP > 0 && ` - ₹${secondaryMRP}`} {/* Only show secondaryMRP if > 0 */}
  </div>

  <div className="selected-price x1">₹{discountedTotal}</div>
</div>
{discount > 0 && (
  <p className="discount-text">
    Discount - <span className="Dis">{discount}% OFF</span>
  </p>
)}

  
  
    
    <div className="price1">Final Price: <span className='Dis'>₹{selectedPrice * quantity}</span></div>
    
    <div className="b1">
    <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.outOfStock) {
                alert('This product is out of stock.');
                return;
              }
              addToCart(product,selectedDurationKey);
            }}
            disabled={product.outOfStock} 
            className="buy-button"
            // Disable button if out of stock
          > {notification && (
            <div className="notification">{notification}</div>
          )}
            {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}  {/* Change button text */}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.outOfStock) {
                return;
              }
              handleBuyClick(product, selectedDurationKey); // Handle Buy Click
            }}
            disabled={product.outOfStock} 
            className="buy-button"
            // Disable button if out of stock
          >
            {product.outOfStock ? 'soon' : 'BUY'}  {/* Change button text */}
          </button>  
            </div>
    <div className="email-delivery-section">
  <p className="delivery-info">Free worldwide Email Delivery Within 30-180min.</p>
  <ul className="delivery-details">
    <li>✔ Doubts or Concerns? Chat with us</li>
    <li>✔ Read Description for all Details</li>
  </ul>
  <div className="safe-checkout">
    <h3>Guaranteed Safe Checkout</h3>
    <div className="checkout-icons">
      <img src="https://themedemo.commercegurus.com/shoptimizer-demodata/wp-content/uploads/sites/53/2018/07/trust-symbols_a.jpg" alt="100% Satisfaction Guarantee" />
    
    </div>
  </div>
</div>
  </div>
  
</div>

<div>
      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <span
            className="tab"
            onClick={() => scrollToSection("premium-navbar")}
          >
            Gallery
          </span>
          <span
            className="tab"
            onClick={() => scrollToSection("tabs-container")}
          >
            Description
          </span>
          <span
            className="tab"
            onClick={() => scrollToSection("highlight2")}
          >
            Reviews
          </span>
        </div>
      </div>
</div>
<div className="section-Discription">
<div className="Discription-icons">
      <img src="https://i1.wp.com/themedemo.commercegurus.com/shoptimizer-demodata/wp-content/uploads/sites/53/2018/07/trust-symbols_a.jpg?resize=1024%2C108&ssl=1" alt="100% Satisfaction Guarantee" />
    
    </div>
<p className="d">
  {product.description2.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ))}
</p>
</div>
<hr></hr>
<div className="centered-text">
  <h1>
    <span className="highlight">Releated</span>Products
  </h1>
  <div className="sketch-line"></div>
  <div className="centered-text">
        <img src={img21} alt="Shop" className="shop" />
      </div>
</div>

<div className='Top-rated-products'>

<div className="product-grid">
   
        {relatedProducts.map((product) => {
          const getSelectedPriceAndDuration = (prices) => {
          if (prices.oneMonth) return { price: prices.oneMonth, duration: "1 Month" };
          if (prices.threeMonths) return { price: prices.threeMonths, duration: "3 Months" };
          if (prices.sixMonths) return { price: prices.sixMonths, duration: "6 Months" };
          if (prices.twelveMonths) return { price: prices.twelveMonths, duration: "12 Months" };
          return { price: 0, duration: "Unavailable" };
        };

        const { price: selectedPrice, duration: selectedDuration } = getSelectedPriceAndDuration(product.prices);
        const discount =
          product.MRP && selectedPrice
            ? Math.round(((product.MRP - selectedPrice) / product.MRP) * 100)
            : 0;

        return (
          <div
            key={product._id}
            className="product-card"
            onClick={() => goToProductDetail(product._id)}
          >
            {discount > 0 && <div className="discount-badge">-{discount}%</div>}
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="rating">★★★★★</div>
            <h3 className="product-name">{product.name}</h3>
            <div className="price-details">
              <span className="mrp">₹{product.MRP}</span>
              <span className="selected-price">₹{selectedPrice}</span>
            </div>
            
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
        addToCart2(product, selectedPrice, selectedDuration);
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
     );
    })}
  
</div>
</div>

<div className="centered-text">
  <h1>
    <span className=" highlight2 highlight">Customer</span>Review
  </h1>
  <div className="sketch-line"></div>
  <div className="centered-text">
        <img src={img21} alt="Shop" className="shop" />
      </div>
</div> 
 <div>
           {/* Product Details Display Code here */}
      <div className="product-detail-page">
      <div className="reviews-section">
        <h3>Reviewed by {reviews.length} customer(s)</h3>
        <div>
          {reviews.slice(0, visibleReviews).map((review) => (
            <div className="review-item" key={review._id}>
              <div className="review-header">
                <img src="https://media.istockphoto.com/id/1351881150/vector/3d-cartoon-character-young-woman-making-good-sign-shows-gesture-cool-customer-review-rating.jpg?s=612x612&w=0&k=20&c=PCAGHomBgTNeBpFE187bgQ_Gjoy1Rm8jCXCdsNhCa3I=" alt="Profile" className="profile-pic" />
                <div className="review-details">
                  <strong>{review.name}</strong>
                  <div className="review-meta">
                    <span className="review-date">{review.date}</span> {/* Replace with actual date */}
                    <span className="verified-badge">✔ Verified Review</span>
                  </div>
                </div>
              </div>
              <p className="review-rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={index < review.rating ? 'star-filled' : 'star-empty'}>
                    ★
                  </span>
                ))}
              </p>
              <p className="review-comment">{review.comment}</p>
              <div className="review-footer">
                <span>Share on:</span>
                <div className="share-icons">
                  <i className="icon-facebook"></i>
                  <i className="icon-twitter"></i>
                  <i className="icon-linkedin"></i>
                </div>
                <div className="helpful">
                  <span>Helpful?</span>
                  <button
                    className="helpful-button"
                    onClick={() => handleHelpfulClick(review._id)}
                  >
                    👍 {helpfulCounts[review._id] || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {visibleReviews < reviews.length && (
            <button className="load-more-button" onClick={loadMoreReviews}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>

      <div className="review-form">
  <h3>Submit Your Review</h3>
  <input 
    type="text" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
    placeholder="Your Name" 
  />
  <textarea 
    value={comment} 
    onChange={(e) => setComment(e.target.value)} 
    placeholder="Your Comment" 
  />
  <div className="rating-stars">
    {Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? "selected" : ""}`}
        onClick={() => setRating(index + 1)}
      >
        ★
      </span>
    ))}
  </div>
  <button
    onClick={() => {
      submitReview(); // Call your review submission logic
      // Reset the input fields
      setName("");
      setComment("");
      setRating(0);
    }}
  >
    Submit
  </button></div>
    </div>
    </>
  );
}

export default ProductDetailPage;
