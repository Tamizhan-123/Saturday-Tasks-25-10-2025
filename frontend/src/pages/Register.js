import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, testConnection, setToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTestConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const result = await testConnection();
      console.log('Connection test successful:', result);
      setError('Backend connection successful!');
    } catch (err) {
      console.error('Connection test failed:', err);
      setError('Backend connection failed: ' + err.message);
    }
  };

  const handleSetToken = () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjEyIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3NjE0MDE0NjgsImV4cCI6MTc2MTQ4Nzg2OH0.LEb2Yioujm_fAQVUewZxXQSmux4Z7MtmG_6tieH567c';
    setToken(token);
    setError('Token set successfully! You can now access protected routes.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting registration form:', formData);
      const result = await register(formData);
      console.log('Registration successful:', result);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <div className="card">
        <div className="card-header">
          <h2 style={{ textAlign: 'center', margin: 0 }}>Register</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <button 
              type="button" 
              onClick={handleTestConnection}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              Test Backend Connection
            </button>
            <button 
              type="button" 
              onClick={handleSetToken}
              className="btn btn-info"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Set Admin Token (For Testing)
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Register'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

