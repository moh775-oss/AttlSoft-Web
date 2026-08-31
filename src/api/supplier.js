// src/api/supplier.js
import axios from 'axios';
import { API_URL } from '@/config/api';


export const fetchSuppliers = async () => {
  const { data } = await api.get(`${API_URL}/Importer`);

  return data.data.map(item => ({
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


export const addSupplier = async (importerData) => {
   try {
    console.log(importerData);
        const response = await api.post(
            `${API_URL}/Importer`,
            {
                impName: importerData.name,
                vatNo: importerData.vatNo,
                address: importerData.address,
                phone: importerData.phone,
                depitLimit: importerData.debitLimit ,
                balance: importerData.balance,
                branch: importerData.branch,
                userId: importerData.userId,
                address2: importerData.address2,
                bussnsNo: importerData.bussnsNo,
                country: importerData.country,
                city: importerData.city,
                street: importerData.street,
                areaLocation: importerData.areaLocation,
                buildNumber: importerData.buildNumber,
                theCode: importerData.theCode,
                schemCode: importerData.schemCode,
                both: importerData.both,
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
                "حدث خطأ أثناء إضافة المورد",
            error: error.response?.data || error.message,
        };
    }
};


export const updateSupplier = async (id, importerData) => {
  try {
    console.log(importerData);
        const response = await api.put(
            `${API_URL}/Importer?ID_IM=${id}`,
            {
                impName: importerData.name,
                vatNo: importerData.vatNo,
                address: importerData.address,
                phone: importerData.phone,
                depitLimit: importerData.debitLimit || 0,
                balance: importerData.balance,
                branch: importerData.branch,
                userId: importerData.userId,
                address2: importerData.address2,
                bussnsNo: importerData.bussnsNo,
                country: importerData.country,
                city: importerData.city,
                street: importerData.street,
                areaLocation: importerData.areaLocation,
                buildNumber: importerData.buildNumber,
                theCode: importerData.theCode,
                schemCode: importerData.schemCode || 'CRN',  
                both: importerData.both,
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
                "حدث خطأ أثناء تعديل المورد",
            error: error.response?.data || error.message,
        };
    }
};

// حذف مورد
export const deleteSupplier = async (id, branchId = 1, userId = 1) => {
  try {
        const response = await api.delete(
            `${API_URL}/Importer?id=${id}&BranchId=${branchId}&UserId=${userId}`
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
                "حدث خطأ أثناء حذف المورد",
            error: error.response?.data || error.message,
        };
    }
};



