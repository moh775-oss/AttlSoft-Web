// src/api/customer.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب العملاء
export const fetchCustomers = async () => {
  const { data } = await axios.get(`${API_URL}/Amail/get`);

  return data.map(item => ({
    id: item.customerId,
    code: item.customerId,
    name: item.cusName,
    vatNo: item.vatNo || '',
    accNo: item.accNo,
    address: item.address || '',
    phone: item.phone || '',
    debitLimit: item.depitLimit || 0,
    balance: item.balance || 0,
    branch: item.branch,
    userId: item.userId,
    srlCode: item.srlCode || '',
    address2: item.address2 || '',
    bussnsNo: item.bussnsNo || '',
    country: item.country || '',
    city: item.city || '',
    street: item.street || '',
    areaLocation: item.areaLocation || '',
    buildNumber: item.buildNumber || '',
    theCode: item.theCode || '',
    schemCode: item.schemCode || 'CRN',
    paidType: item.paidType || '',
    both: item.both || false,
    ...item
  }));
};

// إضافة عميل
export const addCustomer = async (values) => {
  const params = {
    Cus_Name: values.name,
    VatNo: values.vatNo || '',
    AccNo: values.accNo || 10000076,
    Address: values.address || '',
    Phone: values.phone || '',
    DepitLimit: values.debitLimit || 0,
    Balance: values.balance || 0,
    Branch: values.branch || 1,
    UserId: values.userId || null,
    address2: values.address2 || '',
    bussns_no: values.bussnsNo || '',
    country: values.country || '',
    city: values.city || '',
    Street: values.street || '',
    AreaLocation: values.areaLocation || '',
    BuildNumber: values.buildNumber || '',
    TheCode: values.theCode || '',
    SchemCode: values.schemCode || 'CRN',
    paid_type: values.paidType || '',
    both: values.both || false,
  };

  try {
    const { data } = await axios.post(
      `${API_URL}/Amail/addAmail`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

// تحديث عميل
export const updateCustomer = async (id, values) => {
  const params = {
    id: id,
    Branch: values.branch || 1,
    Cus_Name: values.name,
    VatNo: values.vatNo || '',
    AccNo: values.accNo || 0,
    Address: values.address || '',
    Phone: values.phone || '',
    DepitLimit: values.debitLimit || 0,
    Balance: values.balance || 0,
    UserId: values.userId || null,
    address2: values.address2 || '',
    bussns_no: values.bussnsNo || '',
    country: values.country || '',
    city: values.city || '',
    Street: values.street || '',
    AreaLocation: values.areaLocation || '',
    BuildNumber: values.buildNumber || '',
    TheCode: values.theCode || '',
    paid_type: values.paidType || '',
    SchemCode: values.schemCode || 'CRN',
    both: values.both || false,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Amail/PutAmail/`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// حذف عميل
export const deleteCustomer = async (id, branchId = 1, userId = null) => {
  const params = {
    id: id,
    BranchId: branchId,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Amail/DelAmail`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};