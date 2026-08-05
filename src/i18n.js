import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enGeneral from "./lang/en/general.json";
import arGeneral from "./lang/ar/general.json";

import enInventory from "./lang/en/inventory.json";
import arInventory from "./lang/ar/inventory.json";

import enMessages from "./lang/en/messages.json";
import arMessages from "./lang/ar/messages.json";

import enPurchese from "./lang/en/purchase.json";
import arPurchese from "./lang/ar/purchase.json";

import enSales from "./lang/en/sales.json";
import arSales from "./lang/ar/sales.json";

import enLanguage from "./lang/en/lang.json";
import arLanguage from "./lang/ar/lang.json";

// اللغة المحفوظة
const savedLanguage = localStorage.getItem("language") || "ar";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...enGeneral,
        ...enInventory,
        ...enMessages,
        ...enPurchese,
        ...enSales,
        ...enLanguage,
      },
    },
    ar: {
      translation: {
        ...arGeneral,
        ...arInventory,
        ...arMessages,
        ...arPurchese,
        ...arSales,
        ...arLanguage,
      },
    },
  },

  lng: savedLanguage,
  fallbackLng: "ar",

  interpolation: {
    escapeValue: false,
  },
});

// عند تغيير اللغة
i18n.on("languageChanged", (lang) => {
  // حفظ اللغة
  localStorage.setItem("language", lang);

  // تحديث الصفحة
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
});

export default i18n;