// src/api/bank.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب البنوك
export const fetchBanks = async () => {
  try {
    const response = await axios.get(`${API_URL}/Bank`);
    
    // التحقق من وجود data في الاستجابة
    const data = response.data?.data || response.data || [];
    
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
export const addBank = async (values) => {
  const params = {
    BankName: values.bankName,
    BranchName: values.branchName,
    AccountNo: values.accNo,
    AccountType: values.accType,
    AccountIban: values.accIban || '',
    UserId: values.userId || 1,
    Branch: values.branch || 1,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Bank/addBank`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding bank:', error);
    throw error;
  }
};

// تحديث بنك
export const updateBank = async (id, values) => {
  const params = {
    BankId: id,
    BankName: values.bankName,
    BranchName: values.branchName,
    AccountNo: values.accNo,
    AccountType: values.accType,
    AccountIban: values.accIban || '',
    UserId: values.userId || 1,
    Branch: values.branch || 1,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Bank/PutBank`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating bank:', error);
    throw error;
  }
};

// حذف بنك
export const deleteBank = async (id, userId = 1) => {
  const params = {
    BankId: id,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Bank/delBank`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting bank:', error);
    throw error;
  }
};