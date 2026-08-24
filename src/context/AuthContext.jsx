// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [branch, setBranch] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
    
//     const storedUser = localStorage.getItem('userId');
//     const storedBranch = localStorage.getItem('branchId');
    
//     if (storedUser && storedBranch) {
//       setUser(JSON.parse(storedUser));
//       setBranch(JSON.parse(storedBranch));
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData, branchData) => {
//     setUser(userData);
//     setBranch(branchData);
//     localStorage.setItem('userId', JSON.stringify(userData));
//     localStorage.setItem('branchId', JSON.stringify(branchData));
//     localStorage.setItem('token', userData.token || '');
//   };

//   const logout = () => {
//     setUser(null);
//     setBranch(null);
//     localStorage.removeItem('userId');
//     localStorage.removeItem('branchId');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const value = {
//     user,
//     branch,
//     login,
//     logout,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };