import axios from "axios";
import { API_URL } from '@/config/api';


/**
 * جلب بيانات الشركة حسب الفرع
 *
 * GET /api/Company?branch=1
 */
export const getCompanyByBranch = async (branchId) => {
    try {
        const response = await api.get(`/Company`, {
            params: {
                branch: branchId,
            },
        });

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? [],
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب بيانات الشركة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب بيانات الشركة حسب ID
 *
 * GET /api/Company/{id}
 */
export const getCompanyById = async (companyId) => {
    try {
        const response = await api.get(
            `/Company/${companyId}`
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
                "حدث خطأ أثناء جلب بيانات الشركة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * إضافة بيانات شركة
 *
 * POST /api/Company
 */
export const createCompany = async (companyData) => {
    try {
        const response = await api.post(`/Company`, {
            companyName: companyData.companyName,
            vatNo: companyData.vatNo,
            address: companyData.address,
            phone1: companyData.phone1,
            phone2: companyData.phone2,
            country: companyData.country,
            city: companyData.city,
            companyEmail: companyData.companyEmail,
            footer1: companyData.footer1,
            footer2: companyData.footer2,
            footer3: companyData.footer3,
            branch: companyData.branch ?? null,
            userId: companyData.userId ?? null,
            commreicalRegister: companyData.commreicalRegister,
            street: companyData.street,
            areaLocation: companyData.areaLocation,
            buildNumber: companyData.buildNumber,
            postOfficeNo: companyData.postOfficeNo,
            schemCode: companyData.schemCode,
            shortAddress: companyData.shortAddress,
            emailPass: companyData.emailPass,
        });

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
                "حدث خطأ أثناء إضافة بيانات الشركة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * تعديل بيانات الشركة
 *
 * PUT /api/Company/{id}
 */
export const updateCompany = async (companyId, companyData) => {
    try {
        const response = await api.put(
            `/Company/${companyId}`,
            {
                companyName: companyData.companyName,
                vatNo: companyData.vatNo,
                address: companyData.address,
                phone1: companyData.phone1,
                phone2: companyData.phone2,
                country: companyData.country,
                city: companyData.city,
                companyEmail: companyData.companyEmail,
                footer1: companyData.footer1,
                footer2: companyData.footer2,
                footer3: companyData.footer3,
                branch: companyData.branch ?? null,
                userId: companyData.userId ?? null,
                commreicalRegister: companyData.commreicalRegister,
                street: companyData.street,
                areaLocation: companyData.areaLocation,
                buildNumber: companyData.buildNumber,
                postOfficeNo: companyData.postOfficeNo,
                schemCode: companyData.schemCode,
                shortAddress: companyData.shortAddress,
                emailPass: companyData.emailPass,
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
                "حدث خطأ أثناء تحديث بيانات الشركة",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * حذف بيانات الشركة
 *
 * DELETE /api/Company/{id}
 */
export const deleteCompany = async (companyId) => {
    try {
        const response = await api.delete(
            `/${companyId}`
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
                "حدث خطأ أثناء حذف بيانات الشركة",
            error: error.response?.data || error.message,
        };
    }
};