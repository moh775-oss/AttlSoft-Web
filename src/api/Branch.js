// src/api/branch.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الفروع
export const fetchBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/syncUser/getbranch`);
    
   
    const data = response.data?.data || response.data || [];
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.branchId || item.id,
      code: item.branchId || item.id,
      name: item.branchName || item.name,
      address: item.branchAddress || item.address || '',
      phone: item.branchPhone || item.phone || '',
      manager: item.branchManger || item.manager || '',
      needSyncronize: item.needSyncronize || false,
      serialDevice: item.serialDevice || '',
      nameDevice: item.nameDevice || '',
      ...item
    }));
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

// إضافة فرع
export const addBranch = async (values) => {
  const params = {
    BranchName: values.name,
    BranchAddress: values.address || '',
    BranchPhone: values.phone || '',
    BranchManger: values.manager || '',
    UserId: values.userId || 1,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Branch/addBranch`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

// تحديث فرع
export const updateBranch = async (id, values) => {
  const params = {
    BranchId: id,
    BranchName: values.name,
    BranchAddress: values.address || '',
    BranchPhone: values.phone || '',
    BranchManger: values.manager || '',
    UserId: values.userId || 1,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Branch/PutBranch`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

// حذف فرع
export const deleteBranch = async (id, userId = 1) => {
  const params = {
    BranchId: id,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Branch/delBranch`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};