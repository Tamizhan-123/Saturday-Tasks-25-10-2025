import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        axios.get('/api/admin/products'),
        axios.get('/api/orders/admin/all')
      ]);
      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductStatusChange = async (productId, isActive) => {
    try {
      await axios.put(`/api/products/${productId}`, { isActive });
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' },
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };
  

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', newProduct);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        imageUrl: ''
      });
      setShowAddProduct(false);
      fetchData();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Products Management
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Orders Management
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Products Management</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="btn btn-primary"
            >
              {showAddProduct ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {showAddProduct && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3>Add New Product</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddProduct}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="price" className="form-label">Price ($)</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        className="form-control"
                        value={newProduct.stockQuantity}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      className="form-control"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="imageUrl" className="form-label">Image URL</label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      className="form-control"
                      value={newProduct.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-success">
                      Add Product
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddProduct(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                  <p>Stock: {product.stockQuantity}</p>
                  <p>Category: {product.category}</p>
                  <p>Status: {product.isActive ? 'Active' : 'Inactive'}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleProductStatusChange(product.id, !product.isActive)}
                      className={`btn ${product.isActive ? 'btn-danger' : 'btn-success'}`}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2>Orders Management</h2>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Order #{order.id}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className="form-control"
                      style={{ width: 'auto' }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
                <small>Ordered by: {order.user && order.user.username ? order.user.username : 'N/A'} on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</small>
              </div>
              
              <div className="card-body">
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Total Amount:</strong> ${order.totalAmount ? parseFloat(order.totalAmount).toFixed(2) : '0.00'}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Shipping Address:</strong>
                  <p style={{ margin: '0.5rem 0' }}>{order.shippingAddress}</p>
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

export default AdminDashboard;
