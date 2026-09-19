
import api from './api';

export const fetchPos = async () => {
  try {
    const response = await api.get(`/Pos_Tbl`);
    const data = response.data?.data || response.data || [];
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
      id: item.PosID || item.id,
      code: item.PosID || item.id,
      posName: item.PosName || '',
      storeId: item.Store_ID || null,
      branch: item.branch || null,
      userId: item.UserID || null,
      ...item,
    }));
  } catch (error) {
    console.error('Error fetching POS:', error);
    return [];
  }
};

export const getPosById = async (id) => {
  try {
    const response = await api.get(`/Pos_Tbl/${id}`);
    return {
      success: true,
      data: response.data?.data || response.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء جلب نقطة البيع',
      data: null,
    };
  }
};

export const addPos = async (values) => {
  try {
    const response = await api.post(`/Pos_Tbl`, {
      PosName: values.posName,
      Store_ID: values.storeId,
      branch: values.branch,
      UserID: values.userId ?? 1,
    });

    return {
      success: true,
      message: response.data?.message || 'تم إضافة نقطة البيع بنجاح',
      data: response.data?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء إضافة نقطة البيع',
      data: null,
    };
  }
};

export const updatePos = async (id, values) => {
  try {
    const response = await api.put(`/Pos_Tbl/${id}`, {
      PosName: values.posName,
      Store_ID: values.storeId,
      branch: values.branch,
      UserID: values.userId ?? 1,
    });

    return {
      success: true,
      message: response.data?.message || 'تم تعديل نقطة البيع بنجاح',
      data: response.data?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء تعديل نقطة البيع',
      data: null,
    };
  }
};

export const deletePos = async (id, branchId = 1, userId = 1) => {
  try {
    const response = await api.delete(
      `/Pos_Tbl/${id}?branch=${branchId}&userId=${userId}`
    );
    return {
      success: true,
      message: response.data?.message || 'تم حذف نقطة البيع بنجاح',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء حذف نقطة البيع',
    };
  }
};