// src/api/branch.js
import api from './api';
import { API_URL } from '@/config/api';

// جلب الفروع
export const fetchBranches = async () => {
  try {
    const response = await api.get(`/Branch`);
    
    
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
/**
 * جلب فرع حسب ID
 *
 * GET /api/Branch/{id}
 */
export const getBranchById = async (branchId) => {
    try {
        const response = await api.get(
            `/Branch/${branchId}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب الفرع",
            error: error.response?.data || error.message,
        };
    }
};


// إضافة فرع
export const addBranch = async (branchData) => {
   try {
        const response = await api.post(`/Branch`, {
            branchName: branchData.branchName,
            branchAddress: branchData.branchAddress,
            branchPhone: branchData.branchPhone,
            branchManger: branchData.branchManger,
            branch: branchData.branch ?? 0,
            userId: branchData.userId ?? 0,
            needSyncronize: branchData.needSyncronize ?? false,
            serialDevice: branchData.serialDevice,
            nameDevice: branchData.nameDevice,
        });

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            id: response.data.id,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة الفرع",
            error: error.response?.data || error.message,
        };
    }
};

// تحديث فرع
export const updateBranch = async (id, branchData) => {
   try {
        const response = await api.put(
            `/Branch/${id}`,
            {
                branchName: branchData.branchName,
                branchAddress: branchData.branchAddress,
                branchPhone: branchData.branchPhone,
                branchManger: branchData.branchManger,
                branch: branchData.branch ?? 0,
                userId: branchData.userId ?? 0,
                needSyncronize: branchData.needSyncronize ?? false,
                serialDevice: branchData.serialDevice,
                nameDevice: branchData.nameDevice,
            }
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل الفرع",
            error: error.response?.data || error.message,
        };
    }
};

// حذف فرع
export const deleteBranch = async (id, userId = 1) => {
  try {
        const response = await api.delete(
            `/${branchId}`
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
                "حدث خطأ أثناء حذف الفرع",
            error: error.response?.data || error.message,
        };
    }
};



