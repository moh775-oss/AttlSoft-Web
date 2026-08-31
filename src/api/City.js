import api from './api';
import { API_URL } from '@/config/api';

// جلب المدن
export const fetchCities = async () => {
  try {
    const response = await api.get(`/City`);
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
    const response = await api.get(`/City/country/${countryId}`);
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
export const addCity = async (cityData) => {
  try {
        const response = await api.post(`/city`, {
            cityName: cityData.cityName,
            cityNameEn: cityData.cityNameEn,
            countryId: cityData.countryId ?? 0,
            branch: cityData.branch ?? 0,
            userId: cityData.userId ?? 0,
        });

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إنشاء المدينة",
            error: error.response?.data || error.message,
        };
    }
};



// تحديث مدينة
export const updateCity = async (id, values) => {
    try {
        const response = await api.put(
            `/City/${id}`,
            {
                cityName: values.cityName,
                cityNameEn: values.cityNameEn,
                countryId: values.countryId ?? 0,
                branch: values.branch ?? 0,
                userId: values.userId ?? 0,
            }
        );
        console.info("data sender is ",response);

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء تعديل المدينة",
            error: error.response?.data || error.message,
        };
    }
};

// حذف مدينة
export const deleteCity = async (id) => {
   try {
        const response = await api.delete(
            `/city/${id}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف المدينة",
            error: error.response?.data || error.message,
        };
    }
};






/**
 * جلب المدن حسب الدولة
 *
 * GET /api/City/country/{countryId}
 */
export const getCitiesByCountry = async (countryId) => {
    try {
        const response = await api.get(
            `/country/${countryId}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب المدن حسب الدولة",
            error: error.response?.data || error.message,
        };
    }
};