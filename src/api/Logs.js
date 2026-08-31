import axios from "axios";
import { API_URL } from '@/config/api';

/**
 * جلب جميع السجلات
 *
 * GET /api/Logs
 */
export const getAllLogs = async () => {
    try {
        const response = await api.get(`/Logs`);

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
                "حدث خطأ أثناء جلب السجلات",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب سجل حسب ID
 *
 * GET /api/Logs/{id}
 */
export const getLogById = async (logId) => {
    try {
        const response = await api.get(
            `/Logs/${logId}`
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
                "حدث خطأ أثناء جلب السجل",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب السجلات حسب الفرع
 *
 * GET /api/Logs/branch/{branchId}
 */
export const getLogsByBranch = async (branchId) => {
    try {
        const response = await api.get(
            `/Logs/branch/${branchId}`
        );

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
                "حدث خطأ أثناء جلب سجلات الفرع",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب سجلات مستخدم معين
 *
 * GET /api/Logs/user/{userId}
 */
export const getLogsByUser = async (userId) => {
    try {
        const response = await api.get(
            `/Logs/user/${userId}`
        );

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
                "حدث خطأ أثناء جلب سجلات المستخدم",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * إضافة سجل
 *
 * POST /api/Logs
 */
export const createLog = async (logData) => {
    try {
        const response = await api.post(`/Logs`, {
            userId: logData.userId,
            operation: logData.operation,
            date: logData.date,
            computerName: logData.computerName,
            branch: logData.branch ?? null,
            userId1: logData.userId1 ?? null,
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
                "حدث خطأ أثناء إضافة السجل",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * تعديل سجل
 *
 * PUT /api/Logs/{id}
 */
export const updateLog = async (logId, logData) => {
    try {
        const response = await api.put(
            `/Logs/${logId}`,
            {
                userId: logData.userId,
                operation: logData.operation,
                date: logData.date,
                computerName: logData.computerName,
                branch: logData.branch ?? null,
                userId1: logData.userId1 ?? null,
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
                "حدث خطأ أثناء تعديل السجل",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * حذف سجل
 *
 * DELETE /api/Logs/{id}
 */
export const deleteLog = async (logId) => {
    try {
        const response = await api.delete(
            `/Logs/${logId}`
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
                "حدث خطأ أثناء حذف السجل",
            error: error.response?.data || error.message,
        };
    }
};