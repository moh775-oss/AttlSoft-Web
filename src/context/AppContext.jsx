// src/context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCompanyByBranch, getCompanyById } from '@/api/Company';
import { fetchBranches } from '@/api/Branch';
import { fetchUsers } from '@/api/User';
import { getUserById } from '@/api/User';
import { getBranchById } from '@/api/Branch';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { userId, branchId, token } = useAuth();
  
  const [company, setCompany] = useState(null);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const defaultCompany = {
    companyId: 0,
    companyName: "شركة اتل سوفت لتقنية المعلومات",
    companyNameEn: "Attlsoft IT Solutions Co.",
    vatNo: "300123456789",
    address: "الرياض - السعودية",
    phone1: "+966 555713183",
    phone2: "",
    country: "السعودية",
    city: "الرياض",
    companyEmail: "info@attlsoft.com",
    footer1: "Attlsoft IT Solutions Co.",
    footer2: "Riyadh - Saudi Arabia",
    footer3: "",
    commreicalRegister: "1010234567",
    street: "",
    areaLocation: "",
    buildNumber: "",
    postOfficeNo: "",
    schemCode: "CRN",
    shortAddress: "",
    emailPass: "",
    branch: 1,
    logo: null,
  };

  // جلب بيانات المستخدم كاملة من API
  const loadCurrentUser = async () => {
    if (!userId) return null;
    try {
      const result = await getUserById(userId);
      if (result.success && result.data) {
        setCurrentUser(result.data);
        localStorage.setItem('currentUser', JSON.stringify(result.data));
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  };

  // جلب بيانات الفرع كاملة من API
  const loadCurrentBranch = async () => {
    if (!branchId) return null;
    try {
      const result = await getBranchById(branchId);
      if (result.success && result.data) {
        setCurrentBranch(result.data);
        localStorage.setItem('currentBranch', JSON.stringify(result.data));
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error loading branch:', error);
      return null;
    }
  };

  const loadCompany = async (branchId = null) => {
    setLoading(true);
    try {
      const targetBranch = branchId || branchId || 1;
      
      let result = await getCompanyByBranch(targetBranch);
      
      if (!result.success || !result.data || result.data.length === 0) {
        result = await getCompanyById(1);
      }
      
      if (result.success && result.data) {
        const companyData = Array.isArray(result.data) ? result.data[0] : result.data;
        setCompany(companyData);
        setLogoPreview(companyData.logo || null);
        localStorage.setItem('company', JSON.stringify(companyData));
        return companyData;
      }
      
      setCompany(defaultCompany);
      setLogoPreview(null);
      localStorage.setItem('company', JSON.stringify(defaultCompany));
      return defaultCompany;
      
    } catch (error) {
      console.error('Error loading company:', error);
      setCompany(defaultCompany);
      setLogoPreview(null);
      return defaultCompany;
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const data = await fetchBranches();
      setBranches(data);
      localStorage.setItem('branches', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error loading branches:', error);
      return [];
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      localStorage.setItem('users', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadStoredData = async () => {
      const storedCompany = localStorage.getItem('company');
      if (storedCompany) {
        try { setCompany(JSON.parse(storedCompany)); } catch (e) {}
      }

      const storedBranches = localStorage.getItem('branches');
      if (storedBranches) {
        try { setBranches(JSON.parse(storedBranches)); } catch (e) {}
      }

      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try { setUsers(JSON.parse(storedUsers)); } catch (e) {}
      }

      const storedCurrentUser = localStorage.getItem('currentUser');
      if (storedCurrentUser) {
        try { setCurrentUser(JSON.parse(storedCurrentUser)); } catch (e) {}
      }

      const storedCurrentBranch = localStorage.getItem('currentBranch');
      if (storedCurrentBranch) {
        try { setCurrentBranch(JSON.parse(storedCurrentBranch)); } catch (e) {}
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadCurrentUser();
      loadCurrentBranch();
    }
    if (branchId) {
      loadCompany(branchId);
      loadBranches();
      loadUsers();
    }
  }, [userId, branchId]);

  const updateCompanyData = async (companyData) => {
    setLoading(true);
    try {
      const result = await updateCompany(companyData.companyId, companyData);
      if (result.success) {
        setCompany(result.data);
        localStorage.setItem('company', JSON.stringify(result.data));
        return result;
      }
      return result;
    } catch (error) {
      console.error('Error updating company:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
      setLogoFile(null);
    }
  };

  const clearAppData = () => {
    setCompany(null);
    setBranches([]);
    setUsers([]);
    setCurrentUser(null);
    setCurrentBranch(null);
    setLogoFile(null);
    setLogoPreview(null);
    localStorage.removeItem('company');
    localStorage.removeItem('branches');
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentBranch');
  };

  const refreshCompany = async () => {
    return await loadCompany(branchId || 1);
  };

  const refreshBranches = async () => {
    return await loadBranches();
  };

  const refreshUsers = async () => {
    return await loadUsers();
  };

  const refreshCurrentUser = async () => {
    return await loadCurrentUser();
  };

  const refreshCurrentBranch = async () => {
    return await loadCurrentBranch();
  };

  const value = {
    company,
    branches,
    users,
    currentUser,
    currentBranch,
    loading,
    logoFile,
    logoPreview,
    loadCompany,
    loadBranches,
    loadUsers,
    loadCurrentUser,
    loadCurrentBranch,
    updateCompanyData,
    handleLogoChange,
    clearAppData,
    refreshCompany,
    refreshBranches,
    refreshUsers,
    refreshCurrentUser,
    refreshCurrentBranch,
    defaultCompany,
    companyName: company?.companyName || defaultCompany.companyName,
    companyAddress: company?.address || defaultCompany.address,
    companyPhone: company?.phone1 || defaultCompany.phone1,
    companyVat: company?.vatNo || defaultCompany.vatNo,
    companyId: company?.companyId || 0,
    userName: currentUser?.userName || '',
    userFullName: currentUser?.fullName || '',
    userEmail: currentUser?.userEmail || '',
    userType: currentUser?.userType || '',
    branchName: currentBranch?.branchName || '',
    branchAddress: currentBranch?.branchAddress || '',
    branchPhone: currentBranch?.branchPhone || '',
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};