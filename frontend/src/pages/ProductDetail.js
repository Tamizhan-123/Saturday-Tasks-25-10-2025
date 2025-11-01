import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.stockQuantity) {
      setError('Quantity exceeds available stock');
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (quantity > product.stockQuantity) {
      setError('Quantity exceeds available stock');
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="alert alert-danger">
          {error || 'Product not found'}
        </div>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div>
              <img 
                src={product.imageUrl || '/api/placeholder/400/300'} 
                alt={product.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </div>
            
            <div>
              <h1 style={{ marginBottom: '1rem' }}>{product.name}</h1>
              <p className="product-price" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                ${product.price}
              </p>
              <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                {product.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Category:</strong> {product.category}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Stock Available:</strong> {product.stockQuantity}
              </div>
              
              {error && (
                <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="quantity" className="form-label">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stockQuantity}
                  style={{ width: '100px' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-success"
                  disabled={product.stockQuantity === 0}
                  style={{ flex: 1 }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary"
                  disabled={product.stockQuantity === 0}
                  style={{ flex: 1 }}
                >
                  Buy Now
                </button>
              </div>
              
              {product.stockQuantity === 0 && (
                <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
                  This product is currently out of stock.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

