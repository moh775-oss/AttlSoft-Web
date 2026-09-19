// src/api/Forms.js
import api from './api';

export const fetchFormsTree = async () => {
  try {
    const response = await api.get('/Forms_Proj');
    console.log('fetchFormsTree response:', response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching forms:', error);
    return [];
  }
};