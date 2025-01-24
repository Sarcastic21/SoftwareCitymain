import React, { useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Admin.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoImage from './Screenshot 2024-11-13 190917.png';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
function AdminPage() {
  const [productName, setProductName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for the menu
  const hamburgerRef = useRef(null);
 
  const [product, setProduct] = useState({
    name: '',
    image: '',
    description: '',
    description2: '',
    MRP: '',
    MRP2: '',

    prices: { 
      oneMonth: '', 
      threeMonths: '', 
      sixMonths: '', 
      twelveMonths: '',
      game:'',
    },
        // This will be the game price (lifetime price)

    category: '',
    showSelectOptions: '', // Initialize as an empty string
  });
  const [deleteName, setDeleteName] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === 'showSelectOptions'
          ? value.toLowerCase() // Convert input to lowercase
          : value,
    }));
  };
  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in product.prices) {
      setProduct((prev) => ({
        ...prev,
        prices: { ...prev.prices, [name]: value },
      }));
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  const markOutOfStock = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/update-product`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,  // Name of the product to be updated
          outOfStock: true,    // Mark as out of stock
        }),
      });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update product');
        }

        alert(result.message); // Show success message
        setProductName(''); // Clear the input
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    }
};
const handleOutOfStockUpdate = async (e) => {
  e.preventDefault();

  try {
      // Send a PUT request to update the outOfStock status
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/update-outofstock`, {

          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productName }),
      });

      const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update product');
        }

        alert(result.message); // Show success message
        setProductName(''); // Clear the input
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    }
};


  const addProduct = async () => {
    const productToSubmit = {
      ...product,
      prices: {
        oneMonth: Number(product.prices.oneMonth),
        threeMonths: Number(product.prices.threeMonths),
        sixMonths: Number(product.prices.sixMonths),
        twelveMonths: Number(product.prices.twelveMonths),
        game:Number(product.prices.game)
      },
    };
    const isShowSelectOptionsValid = product.showSelectOptions === 'yes';

  const finalProduct = {
    ...product,
    showSelectOptions: isShowSelectOptionsValid, // Convert to true if "yes"
  };
    console.log(finalProduct); // Debug: Check the final product data before submitting
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/add-product`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSubmit),
    });

    if (response.ok) {
      alert('Product added successfully');
      setProduct({
        name: '',
        image: '',
        description: '',
        description2: '',
        MRP: '',
        MRP2: '',

        prices: { oneMonth: '', threeMonths: '', sixMonths: '', twelveMonths: '' ,game:'' },
        
        category: '',
        showSelectOptions: '',
        // Reset to default
      });
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
    
  };

  const deleteProduct = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/delete-product/${deleteName}`, {

      method: 'DELETE',
    });
    if (response.ok) alert('Product deleted successfully');
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
    <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
      <img src={logoImage} alt="PremiumCity Logo" className="logo-image" />
    </div>
      {/* Other navbar elements, e.g., search bar, account, and cart buttons */}
    

      {/* Search bar */}
    

      {/* Account and Cart icons */}
     
    </nav>
    <div className="premium-navbar">
      <div className='mobile'>
      <div className='mobilebutton'  onClick={() => navigate('/softwarecity')}>
      Software City
      </div>
      <div className='acc4' onClick={() => navigate('/shop')}>Shop All</div>
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
   
    <div className="admin-container">
      <h2 className="admin-title">Admin Page</h2>

      <input className="admin-input" placeholder="Name" name="name" onChange={handleChange} value={product.name} />
      <input className="admin-input" placeholder="Image URL" name="image" onChange={handleChange} value={product.image} />
      <textarea
  className="admin-textarea"
  placeholder="Description"
  name="description"
  onChange={handleChange}
  value={product.description}
/>    

{/* Render Description with Newlines */}
<div className="description-preview">
  {product.description.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ))}
</div>

<textarea
  className="admin-textarea"
  placeholder="Description2"
  name="description2"
  onChange={handleChange}
  value={product.description2}
/> 

{/* Render Description2 with Newlines */}
<div className="description-preview">
  {product.description2.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ))}
</div>

  <input className="admin-input" placeholder="mrp" name="MRP" onChange={handleChange} value={product.MRP} />
  <input className="admin-input" placeholder="mrp2" name="MRP2" onChange={handleChange} value={product.MRP2} />

      <input className="admin-input" placeholder="1 Month Price" name="oneMonth" onChange={handleChange} value={product.prices.oneMonth} />
      <input className="admin-input" placeholder="3 Months Price" name="threeMonths" onChange={handleChange} value={product.prices.threeMonths} />
      <input className="admin-input" placeholder="6 Months Price" name="sixMonths" onChange={handleChange} value={product.prices.sixMonths} />
      <input className="admin-input" placeholder="12 Months Price" name="twelveMonths" onChange={handleChange} value={product.prices.twelveMonths} />
      <input className="admin-input" placeholder="game-price" name="game" onChange={handleChange} value={product.prices.game} />
     
     
      <select className="admin-select" name="category" onChange={handleChange} value={product.category}>
        <option value="" disabled>Select Category</option>
        <option value="Adult">Adult 18+</option>
        <option value="Cracked">Cracked</option>
        <option value="Entertainment">Entertainment</option>
        <option value="International">International</option>
        <option value="Private">Private</option>
        <option value="Productivity">Productivity</option>
        <option value="Games">Games</option>

      </select>
      
      <label>
  Show Select Options (type "yes" or "no"):
  <input
    type="text"
    name="showSelectOptions"
    value={product.showSelectOptions} // Bind to state
    onChange={handleInputChange} // Handle change
    placeholder="Type 'yes' or 'no'"
  />
</label>
{product.showSelectOptions && !['yes', 'no'].includes(product.showSelectOptions.toLowerCase()) && (
  <p style={{ color: 'red' }}>Please type "yes" or "no" only.</p>
)}

  

      <button className="admin-button" onClick={addProduct}>Add Product</button>
      <div>
    <h2>Mark Product as Out of Stock</h2>
    <input
        type="text"
        placeholder="Enter Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
    />
    <button className="admin-button" onClick={markOutOfStock}>Out of Stock</button>
</div>
<div className="admin-page">

<h2>Update Product Stock Status</h2>
            <form onSubmit={handleOutOfStockUpdate}>
                <div>
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                 <button className="admin-button" type="submit">Update Stock Status</button>

                </div>
            </form>
        </div>

      <h3 className="admin-subtitle">Delete Product</h3>
      <input className="admin-input" placeholder="Product Name" onChange={(e) => setDeleteName(e.target.value)} value={deleteName} />
      <button className="admin-button admin-delete-button" onClick={deleteProduct}>Delete</button>
    </div>
    
    
    </>
  );
}

export default AdminPage;
