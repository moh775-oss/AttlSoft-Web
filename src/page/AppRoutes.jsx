// src/page/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from '@/page/Auth/login.jsx';
import RegisterPage from '@/page/Auth/Register.jsx';
import ProtectedRoute from '@/components/ProtectedRoute';

import CategoryHome from './inventory/categories/index.jsx';
import SuppliersPage from './purchase/Suppliers/index.jsx';
import CustomersPage from './sale/customers/index.jsx';
import UnitsPage from './inventory/units/index.jsx';  
import BankPage from './setup/Banks/index.jsx';
import SafePage from './setup/Safes/index.jsx';
import BranchPage from './setup/Branch/index.jsx';
import TaxPage from './setup/Taxes/index.jsx';
import OmlatPage from './setup/Omlats/index.jsx';
import StorePage from './inventory/Stores/index.jsx';
import CountriesPage from './setup/General/Countries/index.jsx';
import CitiesPage from './setup/General/Cities/index.jsx';
import AreasPage from './setup/General/AreaOfCity/index.jsx';
import CompanyPage from './setup/Company/index.jsx';
import UsersPage from './system/Users/index.jsx';
import UserForm from './system/Users/UserForm.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحات عامة - بدون حماية */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* صفحات محمية - تتطلب تسجيل دخول */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      
      <Route path="/inventory/setup/categories" element={<ProtectedRoute><CategoryHome /></ProtectedRoute>} />
      
      <Route path="/purchase/setup/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
      
      <Route path="/sales/setup/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
      
      <Route path="/inventory/setup/units" element={<ProtectedRoute><UnitsPage /></ProtectedRoute>} />
      
      <Route path="/setup/banks" element={<ProtectedRoute><BankPage /></ProtectedRoute>} />
      
      <Route path="/setup/safes" element={<ProtectedRoute><SafePage /></ProtectedRoute>} />
      
      <Route path="/setup/branches" element={<ProtectedRoute><BranchPage /></ProtectedRoute>} />
      
      <Route path="/setup/taxes" element={<ProtectedRoute><TaxPage /></ProtectedRoute>} />
      
      <Route path="/setup/omlats" element={<ProtectedRoute><OmlatPage /></ProtectedRoute>} />
      
      <Route path="/inventory/setup/stores" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
      
      <Route path="/setup/general/countries" element={<ProtectedRoute><CountriesPage /></ProtectedRoute>} />
      
      <Route path="/setup/general/cities" element={<ProtectedRoute><CitiesPage /></ProtectedRoute>} />
      
      <Route path="/setup/general/areas" element={<ProtectedRoute><AreasPage /></ProtectedRoute>} />
      
      <Route path="/setup/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
      
      <Route path="/system/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      
      <Route path="/system/users/add" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
      
      <Route path="/system/users/edit/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
    </Routes>
  );
}