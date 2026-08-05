import ERPTopNav from "./ERPTopNav";
import AppRoutes from "./page/AppRoutes"; 
import "./App.css";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function App() {
  const { i18n } = useTranslation();
  const isRightToLeft = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    console.log('Language changed to:', i18n.language); // للتأكد
  }, [i18n.language, isRightToLeft]);

  return (
    <div 
      className="app-container" 
      dir={isRightToLeft ? "rtl" : "ltr"}
    >
      <ERPTopNav />
      <main className="app-content" key={i18n.language}>
        <AppRoutes />
      </main>
    </div>
  );
}