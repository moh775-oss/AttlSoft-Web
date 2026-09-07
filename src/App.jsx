import ERPTopNav from "./ERPTopNav";
import AppRoutes from "./page/AppRoutes";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const isRightToLeft = i18n.language === "ar";

  const hideNavPages = ["/login", "/register"];
  const showNav = !hideNavPages.includes(location.pathname);

  useEffect(() => {
  document.body.classList.toggle(
    "home-page-body",
    location.pathname === "/home"
  );
}, [location.pathname]);

  useEffect(() => {
    document.documentElement.dir = isRightToLeft ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRightToLeft]);

  return (
    <div
      className="app-container"
      dir={isRightToLeft ? "rtl" : "ltr"}
    >
      {showNav && <ERPTopNav />}

      <main className="app-content" key={i18n.language}>
        <AppRoutes />
      </main>
    </div>

    
  );
}

