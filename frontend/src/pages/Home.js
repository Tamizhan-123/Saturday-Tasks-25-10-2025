import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        // Show first 6 products as featured
        setFeaturedProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="hero-section" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to ClickCart</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Discover amazing products at unbeatable prices
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </section>

      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to={`/products/${product.id}`} 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/products" className="btn btn-secondary btn-lg">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

