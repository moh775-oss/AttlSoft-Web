// src/api/safe.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الصناديق
export const fetchSafes = async () => {
  try {
        const response = await axios.get(
            `${API_URL}/Safe`
        );
 const data=response.data.data|| [];
        return data.map(item => ({
      id: item.safeId || item.id,
      code: item.safeId || item.id,
      name: item.safeName ,
      accNo: item.accCode || '',
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
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب الصناديق",
            error: error.response?.data || error.message,
        };
    }
};

// إضافة صندوق
export const addSafe = async (values) => {
   try {
   

        const response = await axios.post(
            `${API_URL}/Safe`,
            {
                safeName:values.safeName,
                safeBalance: values.safeBalance,
                branchId: values.branchId,
                userId: values.userId,
                allBranch: values.allBranch,
            }
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة الصندوق",
            error: error.response?.data || error.message,
        };
    }
  
};

// تحديث صندوق
export const updateSafe = async (id, safeData) => {
  try {

        const response = await axios.put(
            `${API_URL}/Safe/${id}`,
            {
               safeName:safeData.safeName,
                safeBalance: safeData.safeBalance,
                branchId: safeData.branchId,
                userId: safeData.userId,
                allBranch: safeData.allBranch,
            }
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل الصندوق",
            error: error.response?.data || error.message,
        };
    }
};

// حذف صندوق
export const deleteSafe = async (id) => {
   try {
        const response = await axios.delete(
            `${API_URL}/Safe/${id}`
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف الصندوق",
            error: error.response?.data || error.message,
        };
    }
};


