import axios from 'axios';
import { API_URL } from '@/config/api';

// جلب المجموعات
export const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/Cat/get`);
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => ({
      id: item.catId,
      code: item.catId,
      name: item.catName,
      type: item.catType || 0,
      depId: item.depId || item.dep_ID || 0,
      isActive: item.catStatus !== null && item.catStatus !== undefined ? item.catStatus : true,
      branch: item.branch || 1,
      userId: item.userId || null,
      fontName: item.fontName || '',
      fontSize: item.fontSize || 0,
      fontStyle: item.fontStyle || 0,
      btnColor: item.btnColor || 0,
      btnFontColor: item.btnFontColor || 0,
      ...item
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// إضافة مجموعة
export const addCategory = async (values) => {
  const params = {
    catName: values.name,
    branch: values.branch || 1,
    userId: values.userId || 1,
    cat_Status: values.isActive !== undefined ? values.isActive : true,
  };

  try {
    const { data } = await axios.post(`${API_URL}/Cat/addCat`, params);
    return data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// تحديث مجموعة
export const updateCategory = async (id, categoryData) => {
  try {
    const params = {
      catName: categoryData.name,
      branch: categoryData.branch || 1,
      userId: categoryData.userId || 1,
      cat_Status: categoryData.isActive !== undefined ? categoryData.isActive : true,
    };
    
    const response = await axios.put(`${API_URL}/Cat/PutCat?id=${id}`, params);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// حذف مجموعة
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/Cat/delCat?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};