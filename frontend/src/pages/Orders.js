import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Order #{order.id}</h3>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <small>Ordered on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</small>
              </div>
              
              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Total Amount:</strong> ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Shipping Address:</strong>
                  <p style={{ margin: '0.5rem 0' }}>{order.shippingAddress || 'N/A'}</p>
                </div>
                
                <div>
                  <strong>Items:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map(item => (
                        <li key={item.id}>
                          {item.product && item.product.name ? item.product.name : 'Product (N/A)'} 
                          {' x '}{item.quantity || 0} 
                          {' - $'}{item.totalPrice ? parseFloat(item.totalPrice).toFixed(2) : '0.00'}
                        </li>
                      ))
                    ) : (
                      <li>No items found</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'badge-warning';
    case 'PROCESSING':
      return 'badge-info';
    case 'SHIPPED':
      return 'badge-primary';
    case 'DELIVERED':
      return 'badge-success';
    case 'CANCELLED':
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
};

export default Orders;

