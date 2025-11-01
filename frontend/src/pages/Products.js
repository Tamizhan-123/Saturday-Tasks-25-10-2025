import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    
    try {
      const response = await axios.get(`/api/products/search?keyword=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    if (!category) {
      fetchProducts();
      return;
    }
    
    try {
      const response = await axios.get(`/api/products/category/${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error filtering by category:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Products</h1>
      
      {/* Search and Filter */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCategoryFilter('')}
              className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={product.imageUrl || '/api/placeholder/300/200'} 
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-description">{product.description}</p>
              <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                Stock: {product.stockQuantity} | Category: {product.category}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link 
                  to={`/products/${product.id}`} 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  View Details
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-success"
                  disabled={product.stockQuantity === 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default Products;

