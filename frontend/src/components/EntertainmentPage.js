import React, { useState,useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import logoImage from './Screenshot 2024-11-13 190917.png';
import ContactImage from './Contacticons.png';
import FilterImage from './filter.png';

import './Styles/Allpage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
function EntertainmentPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState(9999); // Price filter for the slider
  const [filteredProducts, setFilteredProducts] = useState([]); // Products filtered by price
  const [notification, setNotification] = useState('');
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuOpen2, setIsMobileMenuOpen2] = useState(false);
  const [isMobileMenuOpen3, setIsMobileMenuOpen3] = useState(false);

  const menuRef = useRef(null); // Reference for the menu
  const hamburgerRef = useRef(null); // Reference for the hamburger icon

  const toggleRef = useRef(null);

  const toggleContactMenu = () => {
    setIsMobileMenuOpen3(!isMobileMenuOpen3);
  };
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search term changes
}, [search]);

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        setCurrentPage(1); // Reset to first page on Enter key press
        event.target.blur(); // Blur the input to close the keyboard on mobile
    }
};
    
  const handleClickOutside = (event) => {
    // Check if the click is outside the menu and hamburger icon
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target)
    ) {

      setIsMobileMenuOpen2(false);
      setIsMobileMenuOpen(false); // Close the menu
      // Close the menu
    }
  };
  const handleClickOutside2 = (event) => {
    // Check if the click is outside the menu and toggle icon
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target)
    ) {
      setIsMobileMenuOpen3(false); // Close the menu
    }
  };
  useEffect(() => {
    if (isMobileMenuOpen3) {
      document.addEventListener("click", handleClickOutside2);
    } else {
      document.removeEventListener("click", handleClickOutside2);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside2);
    };
  }, [isMobileMenuOpen3]);
  
 
  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Handle the change in price filter value when slider move
  const handlePriceFilterChange = (event) => {
    let inputValue = event.target.value.trim().toLowerCase(); // Normalize input (remove leading/trailing spaces and convert to lowercase)
  
    // Optionally, you can remove multiple spaces or replace with a single space
    inputValue = inputValue.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
    
    setPriceFilter(inputValue); // Update the state with the normalized value
  
    // Now you can filter products based on the normalized value
    const filteredProducts = products.filter((product) => {
      // Normalize product name by removing spaces and converting to lowercase
      const productName = product.name.trim().toLowerCase().replace(/\s+/g, ' ');
  
      return (
        productName.includes(inputValue) || // Check if product name matches input
        (product.prices.oneMonth && product.prices.oneMonth <= inputValue) ||
        (product.prices.threeMonths && product.prices.threeMonths <= inputValue) ||
        (product.prices.sixMonths && product.prices.sixMonths <= inputValue) ||
        (product.prices.twelveMonths && product.prices.twelveMonths <= inputValue) ||
        (product.prices.game && product.prices.game <= inputValue)
      );
    });
  
    setFilteredProducts(filteredProducts); // Update the filtered products
  };
  
    const getSliderBackground = () => {
      const percentage = (priceFilter - 0) / (9999 - 0);  // Calculate the percentage value
      const colorStart = 'rgb(133 0 255)';
      const colorEnd = '#fff'; // Orange (high end)
  
      // Calculate the color at the current point in the gradient
      return `linear-gradient(90deg, ${colorStart} ${percentage * 100}%, ${colorEnd} ${percentage * 100}%)`;
    };
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/top-rated-products`);
        if (response.ok) {
          const data = await response.json();
          // Slice the array to include only the first 4 products
          setTopRatedProducts(data.slice(0, 4));
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
    
  

    useEffect(() => {
      fetchProducts();
    }, []);
    
    
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/products?category=Entertainment`);
        const data = await response.json();
        
        // Filter out products with the category 'Games'
        const filteredProducts = data.filter(product => product.category !== 'Games');
        
        // Sort products by creation date in descending order
        const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Create the cart item
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
        quantity: 1, // Fixed quantity of 1
      };
    
      console.log('Added to Cart:', cartItem);
    
      // Retrieve the existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
      // Check if the item already exists in the cart
      const existingItem = existingCart.find(
        (item) => item._id === product._id && item.duration === selectedDuration
      );
    
      if (existingItem) {
        // If the item exists, only show a notification (no updates)
        setNotification(`${product.name} with ${selectedDuration} is already in the cart!`);
        setTimeout(() => {
          setNotification('');
        }, 1000);
      } else {
        // If the item does not exist, add it to the cart
        const updatedCart = [...existingCart, cartItem];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setNotification(`${product.name} added to cart!`);
        setTimeout(() => {
          setNotification('');
        }, 1000);
      }
    };
    

  const goToProductDetail = (productId) => navigate(`/product/${productId}`);

 

 

  // Filter products by name and price
  useEffect(() => {
    const filtered = products.filter((p) => {
      const nameMatches = p.name.toLowerCase().includes(search.toLowerCase());
      const priceMatches =
        (p.prices.oneMonth && p.prices.oneMonth <= priceFilter) ||
        (p.prices.threeMonths && p.prices.threeMonths <= priceFilter) ||
        (p.prices.sixMonths && p.prices.sixMonths <= priceFilter) ||
        (p.prices.twelveMonths && p.prices.twelveMonths <= priceFilter) ||
        (p.prices.game && p.prices.game <= priceFilter);
  
      return nameMatches && priceMatches;
    });
    setFilteredProducts(filtered);
  }, [search, priceFilter, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div className="search-container acc">
      <input
        className="search-bar"
        placeholder="Search Products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress} // Handle Enter key press
      />
    </div>

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
            <button className="dropdown-button" onClick={() => navigate('/account')}>Orders</button>
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


 
<div className="store-container sparkles">
  <div className="left-sidebar">
  <input
        className="search-bar"
        placeholder="Search Products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress} // Handle Enter key press
      />
    <h3> Product Category</h3>
  <div className='category'>
    <div className="Button09" onClick={() => navigate('/home')}>Home</div>
            <div className="Button09" onClick={() => navigate('/adult')}>Adult 18+</div>
            <div className="Button09" onClick={() => navigate('/entertainment')}>Entertainment</div>
            <div className="Button09" onClick={() => navigate('/cracked')}>Cracked</div>
            <div className="Button09" onClick={() => navigate('/international')}>International</div>
            <div className="Button09" onClick={() => navigate('/private')}>Private</div>
            <div className="Button09" onClick={() => navigate('/productivity')}>Productivity</div>

    </div>
    <hr></hr>
    
    <div className="filter-section">
  <h3>Filter by Price</h3>
  <div className="price-slider-container">
    <input
      type="range"
      className="price-slider"
      min="0"
      max="9999"
      value={priceFilter} 
      onChange={handlePriceFilterChange} 
      style={{ background: getSliderBackground() }}  // Apply dynamic background color

    />
  </div>
  <div className="price-range">
    Price: <span className="price-min">₹0</span> — <span className="price-max">{`₹${priceFilter}`}</span>
  </div>
</div>
<hr></hr>
  <div className="top-rated-products2">
  <h3>TOP PRODUCTS</h3>
  <div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="products-container-top">
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
            const { price: selectedPrice } = getSelectedPriceAndDuration(product.prices);

            return (
              <div
                key={product._id}
                className="product-card-top"
                onClick={() => goToProductDetail(product._id)}
              >
                <div className="product-info">
                  <img className="top" src={product.image} alt={product.name} />
                  <div className="product-details3">
                    <h3>{product.name}</h3>
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className={`star ${index < 5 ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
             
                    {/* Display the price dynamically */}
                    <p className="price">
                    <span className="mrp">₹{product.MRP}</span>
                    <span className="selected-price">₹{selectedPrice}</span>
                    </p>
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
</div>

<hr></hr>


<h3>Tags -</h3>

    <div className='Tags'>
    <button className="Tag-Button" onClick={() => navigate('/home')}>Home</button>
            <button className="Tag-Button" onClick={() => navigate('/adult')}>Adult 18+</button>
            <button className="Tag-Button" onClick={() => navigate('/entertainment')}>Entertainment</button>
            <button className="Tag-Button" onClick={() => navigate('/cracked')}>Cracked</button>
            <button className="Tag-Button" onClick={() => navigate('/international')}>International</button>
            <button className="Tag-Button" onClick={() => navigate('/private')}>Private</button>
            <button className="Tag-Button" onClick={() => navigate('/productivity')}>Productivity</button>

    </div>
  </div>

  <div className="right-content">
  <div className="search-container2 ">
      <input className='search-bar2'
          placeholder="Search Products"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress} // Handle Enter key press

    />      
      </div>
      <h1>Store</h1>
      
<h3>
  <Link to="/softwarecity" className="breadcrumb-link">Software City - </Link> 
  <Link to="/shop" className="breadcrumb-link">Shop All - </Link>
  <Link to="/entertainment" className="breadcrumb-link">Entertainment</Link>

</h3>
<div className='Hello'>

<div className=" pagination2">
      <button onClick={prevPage} disabled={currentPage === 1}>-</button>
      <div className="page-numbers">
        {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>+</button>
    </div>
    </div>
    <div className="hamburger-icon2" onClick={() => setIsMobileMenuOpen2(!isMobileMenuOpen2)}  ref={hamburgerRef}>
    <img src={FilterImage} alt="PremiumCity Logo" className="Filter-logo" />
    Filter {/* Hamburger icon */}
      </div>
    {isMobileMenuOpen2 && (
        <div ref={menuRef} className="mobile-menu">
 <div className="left-sidebar1">
  <div className="top-rated-products2">
  <h3>TOP PRODUCTS</h3>
  <div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="products-container-top">
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
            const { price: selectedPrice} = getSelectedPriceAndDuration(product.prices);

            return (
              <div
                key={product._id}
                className="product-card-top"
                onClick={() => goToProductDetail(product._id)}
              >
                <div className="product-info">
                  <img className="top" src={product.image} alt={product.name} />
                  <div className="product-details3">
                    <h3>{product.name}</h3>
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className={`star ${index < 5 ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
             
                    {/* Display the price dynamically */}
                    <p className="price">
                    <span className="mrp">₹{product.MRP}</span>
                    <span className="selected-price">₹{selectedPrice}</span>
                    </p>
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
</div>

<hr></hr>

<div className="filter-section">
      <h3>Filter by Price</h3>
      <div className="price-slider-container">
        <input 
          type="range" 
          min="0" 
          max="9999" 
          value={priceFilter} 
          onChange={handlePriceFilterChange} 
          className="price-slider"
          style={{ background: getSliderBackground() }}  // Apply dynamic background color

        />
      </div>
      <div className="price-range">
        <span>₹0 - </span>
        <span >{`₹${priceFilter}`}</span>
      </div>
    </div>
<hr></hr>
<h3>Tags -</h3>

    <div className='Tags'>
    <button className="Tag-Button" onClick={() => navigate('/home')}>Home</button>
            <button className="Tag-Button" onClick={() => navigate('/adult')}>Adult 18+</button>
            <button className="Tag-Button" onClick={() => navigate('/entertainment')}>Entertainment</button>
            <button className="Tag-Button" onClick={() => navigate('/cracked')}>Cracked</button>
            <button className="Tag-Button" onClick={() => navigate('/international')}>International</button>
            <button className="Tag-Button" onClick={() => navigate('/private')}>Private</button>
            <button className="Tag-Button" onClick={() => navigate('/productivity')}>Productivity</button>

    </div>
  </div>

          </div>
    )}
    <div className="product-grid">
  {loading ? (
    <div className="loading-spinner"></div> // Display spinner while loading
  ) : currentProducts.length === 0 ? (
    <div className="no-products-message">Not found.</div>
  ) : (
    currentProducts.map((product) => {
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
                  addToCart(product, selectedPrice, selectedDuration);
                }}
                disabled={product.outOfStock}
              >
                {notification && (
                  <div className="notification">{notification}</div>
                )}
                {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      );
    })
  )}
</div>




    <div className="pagination">
      <button onClick={prevPage} disabled={currentPage === 1}>-</button>
      <div className="page-numbers">
        {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>+</button>
    </div>
  </div>
</div>
<div className="floating-contact">
  <div
    className="contact-toggle"
    ref={toggleRef}
    onClick={toggleContactMenu}
  >
    <img src={ContactImage} alt="Contact" className="toggle-icon" />
  </div>
  <div
    ref={menuRef}
    className={`contact-menu ${isMobileMenuOpen3 ? "active" : ""}`}
  >
    {/* Telegram Link */}
    <a
      href="https://t.me/YourTelegramHandle"
      target="_blank"
      rel="noopener noreferrer"
      className="menu-item telegram"
    >
      <i className="fab fa-telegram"></i> Telegram
    </a>

    {/* Email Link */}
    <a
      href="mailto:example@mail.com"
      className="menu-item email"
    >
      <i className="fas fa-envelope"></i> Email
    </a>
  </div>
</div>




</div>

  );
}

export default EntertainmentPage;
