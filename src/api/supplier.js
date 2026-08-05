// src/api/supplier.js
import axios from 'axios';
import { API_URL } from '@/config/api';


export const fetchSuppliers = async () => {
  const { data } = await axios.get(`${API_URL}/Importer/get`);

  return data.map(item => ({
    id: item.importerId,
    code: item.importerId,
    name: item.impName,
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
    both: item.both || false,
    ...item
    ,

  }));
};


export const addSupplier = async (values) => {
   const params = {
    ImpName: values.name,
    VatNo: values.vatNo || '',
    AccNo: values.accNo || 10000076,
    Address: values.address || '',
    Phone: values.phone || '',
    DepitLimit: values.debitLimit || 0,
    Balance: values.balance || 0,
    Branch: values.branch || 1,
    UserId: values.userId || null,
    Address2: values.address2 || '',
    BussnsNo: values.bussnsNo || '',
    Country: values.country || '',
    City: values.city || '',
    Street: values.street || '',
    AreaLocation: values.areaLocation || '',
    BuildNumber: values.buildNumber || '',
    TheCode: values.theCode || '',
    SchemCode: values.schemCode || 'CRN',
    Both: values.both || false,
  };


  try {
    const { data } = await axios.post(
      `${API_URL}/Importer/addImporter`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
};

// تحديث مورد
export const updateSupplier = async (id, values) => {
  const params = {
    ID_IM: id,
    ImpName: values.name,
    VatNo: values.vatNo || '',
    AccNo: values.accNo || 0,
    Address: values.address || '',
    Phone: values.phone || '',
    DepitLimit: values.debitLimit || 0,
    Balance: values.balance || 0,
    Branch: values.branch || 1,
    UserId: values.userId || null,
    Address2: values.address2 || '',
    BussnsNo: values.bussnsNo || '',
    Country: values.country || '',
    City: values.city || '',
    Street: values.street || '',
    AreaLocation: values.areaLocation || '',
    BuildNumber: values.buildNumber || '',
    TheCode: values.theCode || '',
    SchemCode: values.schemCode || 'CRN',
    Both: values.both || false,
  };

  try {
    const { data } = await axios.put(
      `${API_URL}/Importer/PutImporter/`,
      null,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

// حذف مورد
export const deleteSupplier = async (id, branchId = 1, userId = null) => {
  const params = {
    id: id,
    BranchId: branchId,
    UserId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${API_URL}/Importer/delImpor`,
      { params }
    );
    return data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};