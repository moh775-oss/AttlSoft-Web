// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslate } from '@/hooks/useTranslate';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const {t} = useTranslate();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">{t('loading')}</p>
      </div> 
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;