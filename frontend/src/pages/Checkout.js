import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const stripePromise = loadStripe('pk_test_51RYkpBIviNTVy4I35TMr5CIWno7GHVE0CiBdwxsDsKzW3y1VzN0cj1aJHvGsaOIgAt6TEWy8lIMVj8uhJif9DR5700muyxdMQG');

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent for all cart items
      // For now, we'll create an order for the first item (can be extended to handle multiple items)
      const firstItem = cartItems[0];
      const paymentResponse = await axios.post('/api/payment/create-payment-intent', {
        productId: firstItem.id,
        quantity: firstItem.quantity,
        shippingAddress: '123 Main St, City, State 12345', // You can add form for this
        billingAddress: '123 Main St, City, State 12345'
      });

      const { clientSecret, paymentIntentId: initialPaymentIntentId } = paymentResponse.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Payment succeeded - now verify payment and create the order in one call
        try {
          // Get the payment intent ID from the result
          const paymentIntentId = result.paymentIntent?.id || initialPaymentIntentId;
          
          // Verify payment with Stripe and create order in one API call
          await axios.post('/api/payment/confirm-and-create-order', {
            productId: firstItem.id,
            quantity: firstItem.quantity,
            shippingAddress: '123 Main St, City, State 12345',
            billingAddress: '123 Main St, City, State 12345',
            paymentIntentId: paymentIntentId
          });

          // Order created successfully
          clearCart();
          onSuccess();
          navigate('/orders');
        } catch (orderError) {
          // Payment succeeded but order creation failed
          setError('Payment successful but order creation failed: ' + (orderError.response?.data || orderError.message));
          console.error('Order creation error:', orderError);
        }
      }
    } catch (err) {
      setError(err.response?.data || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary btn-lg"
        style={{ width: '100%' }}
        disabled={!stripe || loading}
      >
        {loading ? <span className="spinner"></span> : `Pay $${getCartTotal().toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const [success, setSuccess] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Your Cart is Empty</h1>
        <p>Add some products to checkout!</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="alert alert-success">
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3>Order Summary</h3>
        </div>
        <div className="card-body">
          {cartItems.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom: '1px solid #dee2e6'
            }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '1rem 0',
            borderTop: '2px solid #dee2e6',
            marginTop: '1rem',
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Payment Information</h3>
        </div>
        <div className="card-body">
          <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={() => setSuccess(true)} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

