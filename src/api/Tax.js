// src/api/tax.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الضرائب
export const fetchTaxes = async () => {
  try {
    const response = await axios.get(`${API_URL}/GroupsTax/get`);
    
    // التحقق من وجود data في الاستجابة
    const data = response.data?.data || response.data || [];
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      code: item.id,
      name: item.nameAr || item.name,
      nameAr: item.nameAr || '',
      nameEn: item.nameEn || '',
      taxPercent: item.taxPercent || 0,
      isDefault: item.isDefault || false,
      isActive: item.isActive !== undefined ? item.isActive : true,
      userId: item.userId,
      branch: item.branch || 1,
      userUpd: item.userUpd || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching taxes:', error);
    throw error;
  }
};

// إضافة ضريبة
export const addTax = async (values) => {
  const params = {
    NameAr: values.nameAr || values.name,
    NameEn: values.nameEn || '',
    TaxPercent: values.taxPercent || 0,
    IsDefault: values.isDefault || false,
    IsActive: values.isActive !== undefined ? values.isActive : true,
    Branch: values.branch || 1,
    UserId: values.userId || 1,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/GroupsTax/addGroupsTax`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding tax:', error);
    throw error;
  }
};

// تحديث ضريبة
export const updateTax = async (id, values) => {
  const params = {
    Id: id,
    NameAr: values.nameAr || values.name,
    NameEn: values.nameEn || '',
    TaxPercent: values.taxPercent || 0,
    IsDefault: values.isDefault || false,
    IsActive: values.isActive !== undefined ? values.isActive : true,
    Branch: values.branch || 1,
    UserId: values.userId || 1,
    UserUpd: values.userUpd || 1,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/GroupsTax/PutGroupsTax`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating tax:', error);
    throw error;
  }
};

// حذف ضريبة
export const deleteTax = async (id, userId = 1) => {
  const params = {
    Id: id,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/GroupsTax/delGroupsTax`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting tax:', error);
    throw error;
  }
};

// جلب الضريبة الافتراضية
export const fetchDefaultTax = async () => {
  try {
    const taxes = await fetchTaxes();
    return taxes.find(tax => tax.isDefault === true) || taxes[0] || null;
  } catch (error) {
    console.error('Error fetching default tax:', error);
    throw error;
  }
};

// جلب الضريبة حسب النسبة
export const fetchTaxByPercent = async (percent) => {
  try {
    const taxes = await fetchTaxes();
    return taxes.find(tax => tax.taxPercent === percent) || null;
  } catch (error) {
    console.error('Error fetching tax by percent:', error);
    throw error;
  }
};