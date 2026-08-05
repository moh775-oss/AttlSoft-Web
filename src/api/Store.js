import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب المخازن
export const fetchStore = async () => {
  try {
    const response = await axios.get(`${API_URL}/store/get`);
    const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.id || item.storeId,
      code: item.code || item.storeCode || item.id,
      name: item.name || item.storeName,
      manager: item.manager || item.storeManager || '',
      phone: item.phone || item.storePhone || '',
      address: item.address || item.storeAddress || '',
      branch: item.branch || item.branchName || '',
      allBranches: item.allBranches || false,
      isActive: item.isActive !== undefined ? item.isActive : true,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

// إضافة مخزن
export const addStore = async (values) => {
  const params = {
    StoreName: values.name,
    StoreCode: values.code || '',
    StoreManager: values.manager || '',
    Phone: values.phone || '',
    Address: values.address || '',
    Branch: values.allBranches ? null : values.branch,
    AllBranches: values.allBranches || false,
    IsActive: values.isActive !== undefined ? values.isActive : true,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/store/addStore`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding store:', error);
    throw error;
  }
};

// تحديث مخزن
export const updateStore = async (id, values) => {
  const params = {
    StoreId: id,
    StoreName: values.name,
    StoreCode: values.code || '',
    StoreManager: values.manager || '',
    Phone: values.phone || '',
    Address: values.address || '',
    Branch: values.allBranches ? null : values.branch,
    AllBranches: values.allBranches || false,
    IsActive: values.isActive !== undefined ? values.isActive : true,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/store/PutStore`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// حذف مخزن
export const deleteStore = async (id) => {
  const params = {
    StoreId: id,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/store/delStore`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting store:', error);
    throw error;
  }
};