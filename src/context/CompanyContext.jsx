import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCompanyByBranch, getCompanyById, updateCompany } from '@/api/Company';
// import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  // const { branch } = useAuth(); 
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // بيانات افتراضية لشركة اتل سوفت
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

  const loadCompany = async (branchId = null) => {
    setLoading(true);
    try {
      
      const targetBranch = branchId || 1;
      
      
      let result = await getCompanyByBranch(targetBranch);
      
      
      if (!result.success || !result.data || result.data.length === 0) {
        result = await getCompanyById(1);
      }
      
      
      if (result.success && result.data) {
        const companyData = Array.isArray(result.data) ? result.data[0] : result.data;
        setCompany(companyData);
        setLogoPreview(companyData.logo || null);
        return companyData;
      }
      
      
      setCompany(defaultCompany);
      setLogoPreview(null);
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

  
  useEffect(() => {
    loadCompany(1);
  }, []);

  const updateCompanyData = async (companyData) => {
    setLoading(true);
    try {
      const result = await updateCompany(companyData.companyId, companyData);
      if (result.success) {
        setCompany(result.data);
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

  const value = {
    company,
    loading,
    logoFile,
    logoPreview,
    loadCompany,
    updateCompanyData,
    handleLogoChange,
    defaultCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};