import api from '@/api/api';
 export const    getTenants = async () => {
    try {
        const response = await api.get(`/admin/tenants/tenant`);

        return {
            success: true,
            message: response.data?.message || "تم جلب الشركات بنجاح",
            data: response.data?.data || []
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء جلب الشركات",
            data: null
        };
    }
};

 export const getTenantByTenantKey = async (tenantKey) => {
    try {


        const response = await api.get(
            `/admin/tenants/${tenantKey}`
        );

        return {
            success: true,
            message: response.data?.message || "تم جلب بيانات الشركة بنجاح",
            data: response.data?.data || null
        };
         if (data?.tenantKey) {
            localStorage.setItem("tenantKey", data.tenantKey);
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء جلب بيانات الشركة",
            data: null
        };
    }
};

export const addTenant = async (tenantData) => {
    try {
        const response = await api.post(
            `/admin/tenants`,
            tenantData
        );

        return {
            success: true,
            message: response.data?.message || "تمت إضافة الشركة بنجاح",
            data: response.data?.data || response.data || null
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء إضافة الشركة",
            data: null
        };
    }
};

 export const updateTenantStatus = async (tenantKey, isActive) => {
    try {
        const response = await api.put(
            `/admin/tenants/${tenantKey}/toggle-status`,
            isActive
        );

        return {
            success: true,
            message: response.data?.message || "تم تحديث حالة الشركة بنجاح",
            data: response.data?.data || null
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "حدث خطأ أثناء تحديث حالة الشركة",
            data: null
        };
    }
};