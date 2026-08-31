import api from './api';
import { API_URL } from '@/config/api';


// جلب الدول
export const fetchCountries = async () => {
  try {
    const response = await api.get(`/Country`);
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
export const addCountry = async (countryData) => {
    try {
        const response = await api.post(`/Country`, {
            countryId: countryData.id ?? 10,
            countryName: countryData.name,
            countryNameEn: countryData.nameEn || '',
            countryCode: countryData.countryCode,
            phoneCode: countryData.phoneCode || '',
            branch: countryData.branch ?? 1,
            userId: countryData.userId ?? 1,
        });

        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء إنشاء الدولة",
            error: error.response?.data || error.message,
        };
    }
};

// تحديث دولة

export const updateCountry = async (id,countryData) => {
  try {
        const response = await api.put(
            `/Country/${id}`,
            {
            
            countryName: countryData.name,
            countryNameEn: countryData.nameEn,
            countryCode: countryData.countryCode,
            phoneCode: countryData.phoneCode,
            userId: countryData.userId ?? 0,
            branch: countryData.branch ?? 0,
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
                "حدث خطأ أثناء تعديل الدولة",
            error: error.response?.data || error.message,
        };
    }
};

// حذف دولة
export const deleteCountry = async (id) => {
   try {
        const response = await api.delete(
            `/Country/${id}`
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
                "حدث خطأ أثناء حذف الدولة",
            error: error.response?.data || error.message,
        };
    }
};

