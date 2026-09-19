import ERPTopNav from "./ERPTopNav";
import AppRoutes from "./page/AppRoutes";
import "./App.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isRightToLeft = i18n.language === "ar";


  const hideNavPages = ["/login", "/register"];


  const pathname = location.pathname;
  const isRootRedirect = pathname === "/" || pathname === "*";
  const showNav = !hideNavPages.includes(pathname) && !isRootRedirect;


  useLayoutEffect(() => {
    if (isRootRedirect) {
      navigate("/login", { replace: true });
    }
  }, [isRootRedirect, navigate]);


  useLayoutEffect(() => {
    document.body.classList.toggle("home-page-body", pathname === "/home");
  }, [pathname]);


  useLayoutEffect(() => {
    document.documentElement.dir = isRightToLeft ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRightToLeft]);

  return (
    <div className="app-container" dir={isRightToLeft ? "rtl" : "ltr"}>
      {showNav && <ERPTopNav />}

      <main className="app-content" key={i18n.language}>
        <AppRoutes />
      </main>
    </div>
  );
}