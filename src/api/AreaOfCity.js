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

export const addArea = async (areaData) => {
   try {
        const response = await axios.post(`${API_URL}/AreaOfCity`, {
            countryId: areaData.countryId ?? 0,
            cityId: areaData.cityId ?? 0,
            areaName: areaData.areaName,
            areaNameEn: areaData.areaNameEn,
            branch: areaData.branch ?? 0,
            userId: areaData.userId ?? 0,
        });

        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إنشاء المنطقة",
            error: error.response?.data || error.message,
        };
    }
};

// تحديث منطقة 
export const updateArea = async (id, values) => {
    try {
        const response = await axios.put(
            `${API_URL}/AreaOfCity/${id}`,
            {
                countryId: values.countryId ?? 0,
                cityId: values.cityId ?? 0,
                areaName: values.areaName,
                areaNameEn: values.areaNameEn,
                branch: values.branch ?? 0,
                userId: values.userId ?? 0,
                
            }
        );

        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل المنطقة",
            error: error.response?.data || error.message,
        };
    }
};

// حذف منطقة 
export const deleteArea = async (id) => {
   try {
        const response = await axios.delete(
            `${API_URL}/AreaOfCity/${id}`
        );

        return {
            success: response.data.success,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف المنطقة",
            error: error.response?.data || error.message,
        };
    }
};

