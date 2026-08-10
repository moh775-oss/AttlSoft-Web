import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الوحدات
export const fetchUnits = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/Unit/get`);
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.unitId,
      code: item.unitId,
      name: item.unitName,
      branch: item.branch || 1,
      userId: item.userId || null,
      isActive: true,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

// إضافة وحدة
export const addUnit = async (values) => {
  const params = {
    unitName: values.name,
    branch: values.branch || 1,
    userId: values.userId || 1,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Unit/addUnit`,
      params,

    );
    return data;
  } catch (error) {
    console.error('Error adding unit:', error);
    throw error;
  }
};

// تحديث وحدة
export const updateUnit = async (id, values) => {
  const params = {
    unitName: values.name,
    branch: values.branch || 1,
    userId: values.userId || 1,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Unit/PutUnit?id=${id}`,
      params,
      
    );
    return data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

// حذف وحدة
export const deleteUnit = async (id, branchId = 1, userId = 1) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/Unit/deleteUnit?id=${id}&Branch=${branchId}&UserId=${userId}`
    );
    return data;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};