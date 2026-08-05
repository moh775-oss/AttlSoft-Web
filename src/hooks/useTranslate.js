
import { useTranslation } from "react-i18next";

export const useTranslate = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";
  
  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL,
  };
};