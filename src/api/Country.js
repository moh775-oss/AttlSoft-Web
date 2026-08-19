import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الدول
export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/Country`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.countryId,
      code: item.countryId,
      name: item.countryName,
      nameEn: item.countryNameEn || '',
      countryCode: item.countryCode || '',
      phoneCode: item.phoneCode || '',
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// إضافة دولة
export const addCountry = async (values) => {
  
};

// تحديث دولة
export const updateCountry = async (id, values) => {
 
};

// حذف دولة
export const deleteCountry = async (id) => {
  
};