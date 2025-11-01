import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:8080';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Restoring token from localStorage');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Fetch user profile to restore user state
          const response = await axios.get('/api/user/profile');
          const userData = response.data;
          
          // Transform the user data to match login response format
          // Handle roles: can be array of Role objects with .name property (enum), or array of strings
          let roles = [];
          if (userData.roles) {
            if (Array.isArray(userData.roles)) {
              roles = userData.roles.map(role => {
                if (typeof role === 'string') {
                  return role;
                } else if (role.name) {
                  // ERole enum - convert to string like "ROLE_USER" or "ROLE_ADMIN"
                  const roleName = typeof role.name === 'string' ? role.name : role.name.toString();
                  return roleName.startsWith('ROLE_') ? roleName : 'ROLE_' + roleName;
                } else {
                  return role.toString();
                }
              });
            }
          }
          
          const user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            roles: roles
          };
          
          console.log('User session restored:', user);
          setUser(user);
        } catch (error) {
          console.error('Failed to restore user session:', error);
          // Token might be invalid or expired, clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    
    restoreSession();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/signin', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Handle the JWT response properly
      const { token, accessToken, tokenType, ...userData } = response.data;
      const jwtToken = accessToken || token || response.data.token;
      
      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        console.log('Token stored:', jwtToken);
        
        // Ensure roles is an array
        const user = {
          ...userData,
          roles: userData.roles || []
        };
        
        setUser(user);
        return user;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const testConnection = async () => {
    try {
      console.log('Testing backend connection...');
      // Try a simple endpoint first
      const response = await axios.get('/api/auth/test');
      console.log('Backend test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Backend test failed:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration request:', userData);
      console.log('Axios base URL:', axios.defaults.baseURL);
      console.log('Full URL will be:', axios.defaults.baseURL + '/api/auth/signup');
      
      const response = await axios.post('/api/auth/signup', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  };

  const setToken = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token manually set:', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading,
    testConnection,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

