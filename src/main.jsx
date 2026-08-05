import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import "./index.css";
import { ThemeProvider } from './context/ThemeContext';
import "./styles/globalTheme.css";
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import i18n from './i18n.js';
import { I18nextProvider } from 'react-i18next';

function Root() {
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(i18n.language);
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
    };

    i18n.on('languageChanged', handleLanguageChange);
    handleLanguageChange(); // تنفيذ مرة واحدة

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <ConfigProvider direction={direction}>

        <ThemeProvider>
          <AntdApp>
            <App key={lang} /> 
          </AntdApp>
        </ThemeProvider>

    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <Root />
    </I18nextProvider>
  </BrowserRouter>
);