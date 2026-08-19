import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب المناطق
export const fetchAreas = async () => {
  try {
    const response = await axios.get(`${API_URL}/AreaOfCity`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.areaId,
      code: item.areaId,
      name: item.areaName,
      nameEn: item.areaNameEn || '',
      countryId: item.countryId,
      cityId: item.cityId,
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

// جلب مناطق حسب الدولة
export const fetchAreasByCountry = async (countryId) => {
  try {
    const response = await axios.get(`${API_URL}/AreaOfCity/country/${countryId}`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.areaId,
      code: item.areaId,
      name: item.areaName,
      nameEn: item.areaNameEn || '',
      countryId: item.countryId,
      cityId: item.cityId,
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching areas by country:', error);
    throw error;
  }
};

// جلب مناطق حسب المدينة
export const fetchAreasByCity = async (cityId) => {
  try {
    const response = await axios.get(`${API_URL}/AreaOfCity/city/${cityId}`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.areaId,
      code: item.areaId,
      name: item.areaName,
      nameEn: item.areaNameEn || '',
      countryId: item.countryId,
      cityId: item.cityId,
      branch: item.branch || 1,
      userId: item.userId || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching areas by city:', error);
    throw error;
  }
};

// إضافة منطقة 
export const addArea = async (values) => {
  
};

// تحديث منطقة 
export const updateArea = async (id, values) => {
  
};

// حذف منطقة 
export const deleteArea = async (id) => {
  
};