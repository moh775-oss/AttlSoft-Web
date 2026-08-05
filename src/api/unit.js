// src/api/unit.js
import axios from 'axios';
import { API_URL } from '@/config/api';


export const fetchUnits = async () => {
  const { data } = await axios.get(`${API_URL}/Unit/get`);

  return data.map(item => ({
    id: item.unitId  || item.unitId,
    code: item.unitId || '',
    name: item.unitName || item.name,
    description: item.description || '',
    isActive: item.isActive !== undefined ? item.isActive : true,
    branch: item.branch || 1,
    userId: item.userId || null,
    ...item
  }));
};

// إضافة وحدة
export const addUnit = async (values) => {
  const params = {
    UnitName: values.name,
    Branch: values.branch || 1,
    UserId: values.userId || null,
    Code: values.code || '',
    Description: values.description || '',
    IsActive: values.isActive !== undefined ? values.isActive : true,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Unit/addUnit`,
      null,
      { params }
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
    id: id,
    UnitName: values.name,
    Branch: values.branch || 1,
    UserId: values.userId || null,
    Code: values.code || '',
    Description: values.description || '',
    IsActive: values.isActive !== undefined ? values.isActive : true,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Unit/PutUnit/`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

// حذف وحدة
export const deleteUnit = async (id, branchId = 1, userId = null) => {
  const params = {
    id: id,
    Branch: branchId,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Unit/delUnit`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};