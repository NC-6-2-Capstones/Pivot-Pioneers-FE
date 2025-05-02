
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.getToken()) {
          try {
            // Verify token is valid by fetching user profile
            await authService.getUserProfile();
            setUser(currentUser);
          } catch (err) {
            // Token invalid, log out
            authService.logout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Auth functions
  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authService.login(username, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };
  
  const register = async (username, email, password) => {
    try {
      setError(null);
      const data = await authService.register(username, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Registration failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};