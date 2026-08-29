// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedBranch = localStorage.getItem('branch');
    const token = localStorage.getItem('token');
    
    if (storedUser && storedBranch && token) {
      try {
        setUser(JSON.parse(storedUser));
        setBranch(JSON.parse(storedBranch));
      } catch (error) {
        console.error('Error parsing stored data:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, branchData, token) => {
    setUser({ userId: userData.userid, username: userData.username });
    setBranch({ branchId: branchData.branchId });
    localStorage.setItem('user', JSON.stringify({ userId: userData.userid, username: userData.username }));
    localStorage.setItem('branch', JSON.stringify({ branchId: branchData.branchId }));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    setBranch(null);
    localStorage.removeItem('user');
    localStorage.removeItem('branch');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const value = {
    user,
    branch,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!branch,
    userId: user?.userId || null,
    branchId: branch?.branchId || null,
    token: localStorage.getItem('token') || null,
    username: user?.username || '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};