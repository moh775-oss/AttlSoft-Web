import axios from "axios";

import { API_URL } from '@/config/api';
/**
 * جلب جميع المستخدمين
 *
 * GET /api/Users
 */
export const getAllUsers = async () => {
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
                "حدث خطأ أثناء جلب المستخدمين",
            error: error.response?.data || error.message,
        };
    }
};
/**
 * إنشاء مستخدم جديد
 *
 * POST /api/Users
 */
export const createUser = async (userData) => {
    try {
        const response = await axios.post(API_URL, {
            userName: userData.userName,
            userPassWord: userData.userPassWord,
            userType: userData.userType,
            fullName: userData.fullName,
            userEmail: userData.userEmail,
            address: userData.address,

            branchId: userData.branchId ?? 0,

            roleStatus: userData.roleStatus ?? true,
            branch: userData.branch ?? true,
            settings: userData.settings ?? true,
            cat: userData.cat ?? true,
            unit: userData.unit ?? true,
            addPrd: userData.addPrd ?? true,
            prdManage: userData.prdManage ?? true,
            prdManageStore: userData.prdManageStore ?? true,
            store: userData.store ?? true,
            transferStore: userData.transferStore ?? true,
            transferManage: userData.transferManage ?? true,
            sale: userData.sale ?? true,
            reSale: userData.reSale ?? true,
            saleManage: userData.saleManage ?? true,
            reSaleManage: userData.reSaleManage ?? true,
            buy: userData.buy ?? true,
            reBuy: userData.reBuy ?? true,
            buyManage: userData.buyManage ?? true,
            reBuyManage: userData.reBuyManage ?? true,
            barcode1: userData.barcode1 ?? true,
            barcode2: userData.barcode2 ?? true,
            customer: userData.customer ?? true,
            supplier: userData.supplier ?? true,
            supplierAccount: userData.supplierAccount ?? true,
            paidManage: userData.paidManage ?? true,
            logs: userData.logs ?? true,
            pos: userData.pos ?? true,
            qabdManage: userData.qabdManage ?? true,
            allMoves: userData.allMoves ?? true,
            expenseType: userData.expenseType ?? true,
            expense: userData.expense ?? true,
            addEmp: userData.addEmp ?? true,
            job: userData.job ?? true,
            dep: userData.dep ?? true,
            salary: userData.salary ?? true,
            empManage: userData.empManage ?? true,
            records: userData.records ?? true,
            dbBackRestore: userData.dbBackRestore ?? true,
            expdate: userData.expdate ?? true,
            rolesManage: userData.rolesManage ?? true,

            userId1: userData.userId1 ?? 0,
            allBranch: userData.allBranch ?? 0,
            mandoobId: userData.mandoobId ?? 0,
            resSafeId: userData.resSafeId ?? 0,
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
                "حدث خطأ أثناء إنشاء المستخدم",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب مستخدم حسب ID
 *
 * GET /api/Users/{id}
 */
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(
            `${API_URL}/${userId}`
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
                "حدث خطأ أثناء جلب المستخدم",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * تعديل مستخدم
 *
 * PUT /api/Users/{id}
 */
export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${userId}`,
            {
                userName: userData.userName,
                userPassWord: userData.userPassWord,
                userType: userData.userType,
                fullName: userData.fullName,
                userEmail: userData.userEmail,
                address: userData.address,

                branchId: userData.branchId ?? 0,

                roleStatus: userData.roleStatus ?? true,
                branch: userData.branch ?? true,
                settings: userData.settings ?? true,
                cat: userData.cat ?? true,
                unit: userData.unit ?? true,
                addPrd: userData.addPrd ?? true,
                prdManage: userData.prdManage ?? true,
                prdManageStore: userData.prdManageStore ?? true,
                store: userData.store ?? true,
                transferStore: userData.transferStore ?? true,
                transferManage: userData.transferManage ?? true,
                sale: userData.sale ?? true,
                reSale: userData.reSale ?? true,
                saleManage: userData.saleManage ?? true,
                reSaleManage: userData.reSaleManage ?? true,
                buy: userData.buy ?? true,
                reBuy: userData.reBuy ?? true,
                buyManage: userData.buyManage ?? true,
                reBuyManage: userData.reBuyManage ?? true,
                barcode1: userData.barcode1 ?? true,
                barcode2: userData.barcode2 ?? true,
                customer: userData.customer ?? true,
                supplier: userData.supplier ?? true,
                supplierAccount: userData.supplierAccount ?? true,
                paidManage: userData.paidManage ?? true,
                logs: userData.logs ?? true,
                pos: userData.pos ?? true,
                qabdManage: userData.qabdManage ?? true,
                allMoves: userData.allMoves ?? true,
                expenseType: userData.expenseType ?? true,
                expense: userData.expense ?? true,
                addEmp: userData.addEmp ?? true,
                job: userData.job ?? true,
                dep: userData.dep ?? true,
                salary: userData.salary ?? true,
                empManage: userData.empManage ?? true,
                records: userData.records ?? true,
                dbBackRestore: userData.dbBackRestore ?? true,
                expdate: userData.expdate ?? true,
                rolesManage: userData.rolesManage ?? true,

                userId1: userData.userId1 ?? 0,
                allBranch: userData.allBranch ?? 0,
                mandoobId: userData.mandoobId ?? 0,
                resSafeId: userData.resSafeId ?? 0,
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
                "حدث خطأ أثناء تعديل المستخدم",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * حذف مستخدم
 *
 * DELETE /api/Users/{id}
 */
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${userId}`
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
                "حدث خطأ أثناء حذف المستخدم",
            error: error.response?.data || error.message,
        };
    }
};


/**
 * جلب المستخدمين حسب الفرع
 *
 * ملاحظة:
 * المسار الذي أرسلته هو نفسه GET /api/Users/{id}
 *
 * إذا كان الـ API فعلاً يستخدم هذا المسار للفرع،
 * فسيحدث تعارض مع getUserById.
 */
export const getUsersByBranch = async (branchId) => {
    try {
        const response = await axios.get(
            `${API_URL}/${branchId}`
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
                "حدث خطأ أثناء جلب المستخدمين حسب الفرع",
            error: error.response?.data || error.message,
        };
    }
};