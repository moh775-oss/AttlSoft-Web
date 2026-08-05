// src/api/categorie.js
import axios from 'axios';

import { API_URL } from '@/config/api';


export const fetchCategories = async () => {
  const { data } = await axios.get(`${API_URL}/Cat/get`);

  return data.map(item => ({
    id: item.catId,
    code: item.catId,
    name: item.catName,
    type: item.catType,
    description: "",
    isActive: item.catStatus,
    createdAt: new Date(),
    ...item
  }));
};


export const addCategory = async (values) => {
  const params = {
    CatName: values.name,
    Branch: 1,
    UserId: null,
    Dep_ID: null,
    Cat_Status: 1,
    FontName: "",
    FontSize: 0,
    FontStyle: 0,
    BtnColor: 0,
    BtnFontColor: 0,
  };
  console.log("Adding category with params:", params); 

  try {
    const { data } = await axios.post(
      `${API_URL}/Cat/addCat`,
      null,
      { params }
    );

    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// تحديث فئة
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/Cat/PutCat/${id}`, categoryData);
    
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// حذف فئة
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/Cat/delCat/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};