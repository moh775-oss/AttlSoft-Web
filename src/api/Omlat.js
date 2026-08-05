import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب العملات
export const fetchOmlat = async () => {
  try {
    const response = await axios.get(`${API_URL}/omlat/get`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.id || item.omlaId,
      code: item.code || item.omlaCode,
      nameAr: item.nameAr || item.omlaNameAr,
      nameEn: item.nameEn || item.omlaNameEn,
      symbol: item.symbol || item.omlaSymbol,
      exchangeRate: item.exchangeRate || 1,
      fractionNameAr: item.fractionNameAr || '',
      fractionNameEn: item.fractionNameEn || '',
      description: item.description || '',
      isDefault: item.isDefault || false,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching omlat:', error);
    throw error;
  }
};

// إضافة عملة
export const addOmlat = async (values) => {
  const params = {
    OmlaNameAr: values.nameAr,
    OmlaNameEn: values.nameEn,
    OmlaCode: values.code,
    OmlaSymbol: values.symbol,
    ExchangeRate: values.exchangeRate || 1,
    FractionNameAr: values.fractionNameAr || '',
    FractionNameEn: values.fractionNameEn || '',
    Description: values.description || '',
    IsDefault: values.isDefault || false,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/omlat/addOmlat`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding omla:', error);
    throw error;
  }
};

// تحديث عملة
export const updateOmlat = async (id, values) => {
  const params = {
    OmlaId: id,
    OmlaNameAr: values.nameAr,
    OmlaNameEn: values.nameEn,
    OmlaCode: values.code,
    OmlaSymbol: values.symbol,
    ExchangeRate: values.exchangeRate || 1,
    FractionNameAr: values.fractionNameAr || '',
    FractionNameEn: values.fractionNameEn || '',
    Description: values.description || '',
    IsDefault: values.isDefault || false,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/omlat/PutOmlat`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating omla:', error);
    throw error;
  }
};

// حذف عملة
export const deleteOmlat = async (id) => {
  const params = {
    OmlaId: id,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/omlat/delOmlat`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting omla:', error);
    throw error;
  }
};