import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

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




export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inventory/setup/categories" element={<CategoryHome />} />
      <Route path="/purchase/setup/suppliers" element={<SuppliersPage />} />
      <Route path="/sales/setup/customers" element={<CustomersPage />} />
      <Route path="/inventory/setup/units" element={<UnitsPage />} />
      <Route path="/setup/banks" element={<BankPage />} />
      <Route path="/setup/safes" element={<SafePage />} />
      <Route path="/setup/branches" element={<BranchPage />} />
      <Route path="/setup/taxes" element={<TaxPage />} />
      <Route path="/setup/omlats" element={<OmlatPage />} />
      <Route path="/inventory/setup/stores" element={<StorePage />} />
    </Routes>
  ); 
}
