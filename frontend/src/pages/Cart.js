import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Your Cart is Empty</h1>
        <p style={{ marginBottom: '2rem' }}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div className="card">
        <div className="card-body">
          {cartItems.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem', 
              borderBottom: '1px solid #dee2e6',
              gap: '1rem'
            }}>
              <img 
                src={item.imageUrl || '/api/placeholder/100/100'} 
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>{item.description}</p>
                <p className="product-price">${item.price}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <label htmlFor={`quantity-${item.id}`} className="form-label">Qty:</label>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    style={{ width: '80px' }}
                  />
                </div>
                
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            borderTop: '1px solid #dee2e6',
            marginTop: '1rem'
          }}>
            <div>
              <button onClick={clearCart} className="btn btn-secondary">
                Clear Cart
              </button>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Total: ${getCartTotal().toFixed(2)}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/products" className="btn btn-secondary">
                  Continue Shopping
                </Link>
                {user ? (
                  <Link to="/checkout" className="btn btn-primary btn-lg">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-lg">
                    Login to Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

