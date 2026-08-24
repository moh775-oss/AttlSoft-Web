import axios from "axios";
import { API_URL } from '@/config/api';


/**
 * جلب جميع العملات
 * 
 * GET /api/Omlat
 */
export const fetchOmlat = async () => {
    try {
        const response = await axios.get(API_URL);

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
                "حدث خطأ أثناء جلب العملات",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * إضافة عملة جديدة
 *
 * POST /api/Omlat
 */
export const createOmla = async (omlaData) => {
    try {
        const response = await axios.post(API_URL, {
            name: omlaData.name,
            exchange: omlaData.exchange ?? 0,
            isDefault: omlaData.isDefault ?? false,
            isActive: omlaData.isActive ?? true,
            symbol: omlaData.symbol,
            nameEn: omlaData.nameEn,
            country: omlaData.country ?? 0,
            fakaName: omlaData.fakaName,
            fakaNameEn: omlaData.fakaNameEn,
            oneEqualto: omlaData.oneEqualto ?? 0,
            totalFaka: omlaData.totalFaka ?? 0,
            isMain: omlaData.isMain ?? 0,
            createUser: omlaData.createUser ?? 0,
            updateUser: omlaData.updateUser ?? 0,
            updateDate: omlaData.updateDate,
            branch: omlaData.branch ?? 0,
            omlaDesc: omlaData.omlaDesc,
            omltCode: omlaData.omltCode,
        });

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
                "حدث خطأ أثناء إضافة العملة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب عملة حسب ID
 *
 * GET /api/Omlat/{id}
 */
export const getOmlaById = async (omlaId) => {
    try {
        const response = await axios.get(
            `${API_URL}/${omlaId}`
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
                "حدث خطأ أثناء جلب العملة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * تعديل عملة
 *
 * PUT /api/Omlat/{id}
 */
export const updateOmla = async (omlaId, omlaData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${omlaId}`,
            {
                name: omlaData.name,
                exchange: omlaData.exchange ?? 0,
                isDefault: omlaData.isDefault ?? false,
                isActive: omlaData.isActive ?? true,
                symbol: omlaData.symbol,
                nameEn: omlaData.nameEn,
                country: omlaData.country ?? 0,
                fakaName: omlaData.fakaName,
                fakaNameEn: omlaData.fakaNameEn,
                oneEqualto: omlaData.oneEqualto ?? 0,
                totalFaka: omlaData.totalFaka ?? 0,
                isMain: omlaData.isMain ?? 0,
                createUser: omlaData.createUser ?? 0,
                updateUser: omlaData.updateUser ?? 0,
                updateDate: omlaData.updateDate,
                branch: omlaData.branch ?? 0,
                omlaDesc: omlaData.omlaDesc,
                omltCode: omlaData.omltCode,
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
                "حدث خطأ أثناء تعديل العملة",
            error: error.response?.data || error.message,
        };
    }
};
/**
 * حذف عملة
 *
 * DELETE /api/Omlat/{id}
 */
export const deleteOmla = async (omlaId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${omlaId}`
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
                "حدث خطأ أثناء حذف العملة",
            error: error.response?.data || error.message,
        };
    }
};