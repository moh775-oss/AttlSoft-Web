// src/api/safe.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الصناديق
export const fetchSafes = async () => {
  try {
    const response = await axios.get(`${API_URL}/Safe`);
    

    const data = response.data?.data || response.data || [];
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.safeId || item.id,
      code: item.safeId || item.id,
      name: item.safeName || item.name,
      accNo: item.accCode || item.accNo || '',
      branch: item.branchId ,
      branchId: item.branchId ,
      allBranches: item.allBranch || item.allBranches || false,
      balance: item.safeBalance || 0,
      startDate: item.startDate || null,
      userId: item.userId,
      srlCode: item.srlCode || '',
      ...item
    }));
  } catch (error) {
    console.error('Error fetching safes:', error);
    throw error;
  }
};

// إضافة صندوق
export const addSafe = async (values) => {
  const params = {
    SafeName: values.name,
    AccCode: values.accNo,
    BranchId: values.allBranches ? null : values.branch,
    AllBranch: values.allBranches || false,
    UserId: values.userId || 1,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Safe/addSafe`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding safe:', error);
    throw error;
  }
};

// تحديث صندوق
export const updateSafe = async (id, values) => {
  const params = {
    SafeId: id,
    SafeName: values.name,
    AccCode: values.accNo,
    BranchId: values.allBranches ? null : values.branch,
    AllBranch: values.allBranches || false,
    UserId: values.userId || 1,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Safe/PutSafe`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating safe:', error);
    throw error;
  }
};

// حذف صندوق
export const deleteSafe = async (id, branchId = 1, userId = 1) => {
  const params = {
    SafeId: id,
    BranchId: branchId,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Safe/delSafe`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting safe:', error);
    throw error;
  }
};