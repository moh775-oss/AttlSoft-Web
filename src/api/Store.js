
import axios from 'axios';
import { API_URL } from '@/config/api';
import { fetchBranches } from './Branch';
// جلب المخازن
export const fetchStore = async () => {
  try {
     const response = await axios.get(
            `${API_URL}/store`
        );

        const data = response.data?.data || response.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

      const branches = await fetchBranches();
    const branchesMap = {};
    branches.forEach(b => {
      branchesMap[b.id] = b.name;
    });

    return data.map(item => ({
      id: item.id || item.storeId,
      code: item.storeId || item.id,
      name:  item.storeName,
      manager:  item.storeManger || '',
      phone:  item.storePhone || '',
      address:  item.storeAddress || '',
      branch: item.branch || '',
      userId: item.userId || null,
      branchName: branchesMap[item.branchId] ||  '',
      allBranches: item.allBranch || false,
      isActive: item.isActive !== undefined ? item.isActive : true,
      ...item
    }));
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب المخازن",
            error: error.response?.data || error.message,
        };
    }
};
/**
 * جلب مخزن حسب ID
 *
 * GET /api/store/{id}
 */
export const getStoreById = async (storeId) => {
    try {
        const response = await axios.get(
            `${API_URL}/store/${storeId}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
            time: response.data.time,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب المخزن",
            error: error.response?.data || error.message,
        };
    }
};

/**
 * جلب المخازن حسب الفرع
 *
 * GET /api/store/branch/{branchId}
 */
export const getStoresByBranch = async (branchId) => {
    try {
        const response = await axios.get(
            `${API_URL}/store/branch/${branchId}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? [],
            count: response.data.count ?? 0,
            time: response.data.time,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء جلب مخازن الفرع",
            error: error.response?.data || error.message,
        };
    }
};


// إضافة مخزن
export const addStore = async (storeData) => {
   try {
        const response = await axios.post(`${API_URL}/store`, {
            storeName: storeData.storeName,
            storePhone: storeData.storePhone,
            storeAddress: storeData.storeAddress,
            storeManger: storeData.storeManger,

            branchId: storeData.branchId,
            branch: storeData.branch ?? null,
            userId: storeData.userId ?? null,
            allBranch: storeData.allBranch ?? false,
            stoped: storeData.stoped ?? false,
        });

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
            time: response.data.time,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة المخزن",
            error: error.response?.data || error.message,
        };
    }
};

// تحديث مخزن
export const updateStore = async (id, storeData) => {
  try {
        const response = await axios.put(
            `${API_URL}/store/${id}`,
            {
                storeName: storeData.storeName,
                storePhone: storeData.storePhone,
                storeAddress: storeData.storeAddress,
                storeManger: storeData.storeManger,

                branchId: storeData.branchId,
                branch: storeData.branch ?? null,
                userId: storeData.userId ?? null,
                allBranch: storeData.allBranch ?? false,
                stoped: storeData.stoped ?? false,
            }
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
            time: response.data.time,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل المخزن",
            error: error.response?.data || error.message,
        };
    }
};

// حذف مخزن
export const deleteStore = async (id) => {
   try {
        const response = await axios.delete(
            `${API_URL}/store/${id}`
        );

        return {
            success: response.data.success ?? true,
            message: response.data.message,
            data: response.data.data ?? null,
            time: response.data.time,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف المخزن",
            error: error.response?.data || error.message,
        };
    }
};



