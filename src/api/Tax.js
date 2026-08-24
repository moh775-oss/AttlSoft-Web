// src/api/tax.js
import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب الضرائب
export const fetchTaxes = async () => {
  try {
    const response = await axios.get(`${API_URL}/TaxGroups`);
    
    // التحقق من وجود data في الاستجابة
    const data = response.data?.data || response.data || [];
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      code: item.id,
      name: item.nameAr || item.name,
      nameAr: item.nameAr || '',
      nameEn: item.nameEn || '',
      taxPercent: item.taxPercent || 0,
      isDefault: item.isDefault || false,
      isActive: item.isActive !== undefined ? item.isActive : true,
      userId: item.userId,
      branch: item.branch || 1,
      userUpd: item.userUpd || null,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching taxes:', error);
    throw error;
  }
};

/**
 * إضافة مجموعة ضريبة
 *
 * POST /api/TaxGroups/addGroupTax
 */
export const createTaxGroup = async (taxData) => {
    try {
        const response = await axios.post(
            `${API_URL}/TaxGroups/addGroupTax`,
            {
                nameAr: taxData.nameAr,
                nameEn: taxData.nameEn,
                taxPercent: taxData.taxPercent ?? 0,
                isDefault: taxData.isDefault ?? false,
                isActive: taxData.isActive ?? true,
                createDate: taxData.createDate,
                userId: taxData.userId ?? 0,
                branch: taxData.branch ?? 0,
                updateDate: taxData.updateDate,
                userUpd: taxData.userUpd ?? 0,
            }
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة مجموعة الضريبة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * حذف مجموعة ضريبة
 *
 * DELETE /api/TaxGroups/DelTax
 */
export const deleteTaxGroup = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/TaxGroups/DelTax?id=${id}`);

        return {
            success: response.data.success ?? true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء حذف مجموعة الضريبة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * تعديل مجموعة ضريبة
 *
 * PUT /api/TaxGroups
 */
export const updateTaxGroup = async (taxData) => {
    try {
        const response = await axios.put(
            `${API_URL}/TaxGroups?id=${taxData.id}`,
            {
                id: taxData.id,
                nameAr: taxData.nameAr,
                nameEn: taxData.nameEn,
                taxPercent: taxData.taxPercent ?? 0,
                isDefault: taxData.isDefault ?? false,
                isActive: taxData.isActive ?? true,
                createDate: taxData.createDate,
                userId: taxData.userId ?? 0,
                branch: taxData.branch ?? 0,
                updateDate: taxData.updateDate,
                userUpd: taxData.userUpd ?? 0,
            }
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? response.data,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل مجموعة الضريبة",
            error: error.response?.data || error.message,
        };
    }
};