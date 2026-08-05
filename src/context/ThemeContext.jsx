import React, { createContext, useState, useContext, useEffect, useMemo, useTransition } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import arEG from 'antd/locale/ar_EG';
import { lightTheme, darkTheme } from '../styles/themeSystem';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isPending, startTransition] = useTransition();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('attlsoft-theme');
    return saved === 'dark';
  });

  const toggleTheme = () => {
    // منع الـ flickering
    const root = document.documentElement;
    root.style.transition = 'none';
    
    startTransition(() => {
      setIsDarkMode(prev => {
        const newMode = !prev;
        localStorage.setItem('attlsoft-theme', newMode ? 'dark' : 'light');
        return newMode;
      });
    });
    
    // إعادة التشغيل بعد تغيير بسيط
    setTimeout(() => {
      root.style.transition = '';
    }, 50);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // تطبيق CSS Variables بشكل كامل مع إجبار إعادة الرسم
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;
    
    // منع إعادة الرسم المتكرر
    root.style.willChange = 'background-color, color';
    
    // تطبيق كل الألوان كـ CSS Variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // تطبيق الخطوط
    Object.entries(currentTheme.fonts).forEach(([key, value]) => {
      if (key !== 'main' && key !== 'heading') {
        root.style.setProperty(`--font-size-${key}`, value);
      }
    });
    root.style.setProperty('--font-family-main', currentTheme.fonts.main);
    root.style.setProperty('--font-family-heading', currentTheme.fonts.heading);
    
    // تطبيق التباعد
    Object.entries(currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // تطبيق الزوايا
    Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // تطبيق الظلال
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      if (key.startsWith('shadow')) {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // إضافة كلاس للـ body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // تغيير لون شريط المتصفح (meta theme-color)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.bgPrimary);
    }
    
    // 💥 إجبار المتصفح على إعادة الرسم دفعة واحدة
    root.classList.add('theme-changing');
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-changing');
        root.style.willChange = 'auto';
      });
    });
    
  }, [isDarkMode, currentTheme]);

  // Ant Design theme config with useMemo لمنع إعادة الرسم غير الضرورية
  const antdThemeConfig = useMemo(() => ({
    algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.colors.primary,
      colorBgBase: currentTheme.colors.bgPrimary,
      colorBgContainer: currentTheme.colors.bgCard,
      colorText: currentTheme.colors.textPrimary,
      colorTextSecondary: currentTheme.colors.textSecondary,
      colorBorder: currentTheme.colors.borderPrimary,
      borderRadius: 8,
      fontFamily: currentTheme.fonts.main,
    },
    components: {
      Layout: {
        headerBg: currentTheme.colors.bgHeader,
        siderBg: currentTheme.colors.bgSidebar,
        bodyBg: currentTheme.colors.bgPrimary,
      },
      Card: {
        colorBgContainer: currentTheme.colors.bgCard,
        colorBorderSecondary: currentTheme.colors.borderCard,
      },
      Table: {
        headerBg: currentTheme.colors.bgTableHeader,
        rowHoverBg: currentTheme.colors.bgTableRowHover,
        borderColor: currentTheme.colors.borderTable,
      },
      Button: {
        defaultBg: currentTheme.colors.btnDefaultBg,
        defaultBorderColor: currentTheme.colors.btnDefaultBorder,
        defaultHoverBg: currentTheme.colors.btnDefaultHover,
        primaryBg: currentTheme.colors.btnPrimaryBg,
        primaryHoverBg: currentTheme.colors.btnPrimaryHover,
      },
      Input: {
        colorBgContainer: currentTheme.colors.bgInput,
        colorBorder: currentTheme.colors.borderInput,
        activeBorderColor: currentTheme.colors.borderInputFocus,
      },
      Modal: {
        colorBgElevated: currentTheme.colors.bgModal,
      },
      Select: {
        colorBgContainer: currentTheme.colors.bgSelect,
      },
    },
  }), [isDarkMode, currentTheme]);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      theme: currentTheme,
      colors: currentTheme.colors,
      isPending, // يمكنك استخدامها لإضافة loading state
    }}>
      <ConfigProvider theme={antdThemeConfig} locale={arEG} direction="rtl">
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};