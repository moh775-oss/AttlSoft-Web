// src/api/bank.js
import api from './api';
import { API_URL } from '@/config/api';

// جلب البنوك


export const fetchBanks = async () => {
  try {
    const response = await api.get(`/Bank`);
    
    // التحقق من وجود data في الاستجابة
    const data = response.data?.data || response.data || [];
    4
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.bankId || item.id,
      code: item.bankId || item.id,
      bankName: item.bankName || item.name,
      branchName: item.branchName || item.branch || '',
      accNo: item.accountNo || item.accNo || '',
      accType: item.accountType || item.accType || '',
      accIban: item.accountIban || '',
      balance: item.accountBalance || 0,
      userId: item.userId,
      branch: item.branch,
      srlCode: item.srlCode || '',
      ...item
    }));
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};

// إضافة بنك

export const addBank = async (bankData) => {
  try {
    console.log(bankData);
        const response = await api.post(
            `/Bank`,
            {
                bankName: bankData.bankName,
                branchName: bankData.branchName,
                accountType: bankData.accountType,
                accountIban: "j",
                accountBalance: 0,
                userId: bankData.userId || 1,
                branch: bankData.branch || 1,
            }
        );

        return {
            success: response.data.success ?? response.data.Success ?? false,
            message: response.data.message ?? response.data.Message,
            bankId: response.data.bankId ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة البنك",
            error: error.response?.data || error.message,
        };
    }
};

// تحديث بنك
export const updateBank = async (id, bankData) => {
  try {
        const response = await api.put(
            `/Bank/${id}`,
            {
                 bankName: bankData.bankName,
                branchName: bankData.branchName,
                accountType: bankData.accountType,
                accountIban: "j",
                accountBalance: 0,
                userId: bankData.userId || 1,
                branch: bankData.branch || 1,
            }
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            bankId: response.data.bankId ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل البنك",
            error: error.response?.data || error.message,
        };
    }
};

// حذف بنك
export const deleteBank = async (id) => {
  try {
        const response = await api.delete(
            `/Bank/${id}`
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            canDelete: response.data.canDelete ?? false,
            bankId: response.data.bankId ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف البنك",
            error: error.response?.data || error.message,
        };
    }
};


