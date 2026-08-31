// src/api/login.js
import api from './api';

export const logins = async (userName, password, branch, tenantKey) => {
  try {
    const payload = {
      userName: userName,
      password: password,
      branch: branch || 1,
      tenantKey: tenantKey || "company_3"
    };

    const response = await api.post(`/auth/login`, payload);

    const data = response.data;

    if (data?.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("tenantKey", tenantKey);
    }

    return {
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.Message || error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول",
      data: null
    };
  }
};