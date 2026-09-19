
import api from './api';

export const fetchUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/UserPermissions/user/${userId}`);
    console.log('fetchUserPermissions response:', response.data);
    return {
      success: true,
      data: response.data?.data || {},
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ',
      data: {},
    };
  }
};

export const saveUserPermissions = async (userId, permissions) => {
  try {
    const response = await api.post(`/UserPermissions/${userId}`, permissions);
    return {
      success: true,
      message: response.data?.message || 'تم الحفظ بنجاح',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء الحفظ',
    };
  }
};