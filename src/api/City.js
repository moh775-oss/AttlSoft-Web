import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب المدن
export const fetchCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/City`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.cityId,
      code: item.cityId,
      name: item.cityName,
      nameEn: item.cityNameEn || '',
      countryId: item.countryId,
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

// جلب مدن حسب الدولة
export const fetchCitiesByCountry = async (countryId) => {
  try {
    const response = await axios.get(`${API_URL}/City/country/${countryId}`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.cityId,
      code: item.cityId,
      name: item.cityName,
      nameEn: item.cityNameEn || '',
      countryId: item.countryId,
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching cities by country:', error);
    throw error;
  }
};

// إضافة مدينة
export const addCity = async (values) => {
  
};

// تحديث مدينة
export const updateCity = async (id, values) => {
  
};

// حذف مدينة
export const deleteCity = async (id) => {
  
};