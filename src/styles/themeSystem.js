const baseColors = {
  // الألوان الرئيسية
  primary: '#1890ff',
  primaryDark: '#177ddc',
  primaryLight: '#40a9ff',
  primaryHover: '#2f54eb',
  
  secondary: '#52c41a',
  secondaryDark: '#49aa19',
  secondaryLight: '#73d13d',
  
  danger: '#ff4d4f',
  dangerDark: '#d9363e',
  dangerLight: '#ff7875',
  
  warning: '#faad14',
  warningDark: '#d89614',
  warningLight: '#ffc53d',
  
  success: '#52c41a',
  successDark: '#49aa19',
  successLight: '#95de64',
  
  info: '#13c2c2',
  infoDark: '#08979c',
  infoLight: '#5cdbd3',
  
  // الألوان المحايدة
  white: '#ffffff',
  black: '#000000',
  gray: '#8c8c8c',
  grayLight: '#f5f5f5',
  grayDark: '#434343',
  
  // ألوان إضافية للأزرار
  purple: '#722ed1',
  purpleLight: '#9254de',
  purpleDark: '#531dab',
  
  orange: '#fa8c16',
  orangeLight: '#ffa940',
  orangeDark: '#d46b08',
  
  pink: '#eb2f96',
  pinkLight: '#f759ab',
  pinkDark: '#c41d7f',
};

// ========== الثيم الفاتح (Light Mode) ==========
export const lightTheme = {
  mode: 'light',
  
  colors: {
    ...baseColors,
    
    // الخلفيات (Backgrounds)
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#fafafa',
    bgSidebar: '#001529',
    bgHeader: '#ffffff',
    bgCard: '#ffffff',
    bgModal: '#ffffff',
    bgDrawer: '#ffffff',
    bgTable: '#ffffff',
    bgTableHeader: '#1890ff',     // رأس الجدول أزرق في النهار
    bgTableRowHover: '#f5f5f5',   // لون hover فاتح
    bgInput: '#ffffff',
    bgButton: '#f5f5f5',
    bgSelect: '#ffffff',
    
    // النصوص (Texts)
    textPrimary: '#000000',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    textDisabled: '#bfbfbf',
    textPlaceholder: '#bfbfbf',
    textLink: '#1890ff',
    textLinkHover: '#40a9ff',
    textOnPrimary: '#ffffff',
    textOnSecondary: '#ffffff',
    textOnDanger: '#ffffff',
    textOnTableHeader: '#ffffff',  // نص رأس الجدول أبيض
    
    // الحدود (Borders)
    borderPrimary: '#d9d9d9',
    borderSecondary: '#f0f0f0',
    borderTable: '#f0f0f0',
    borderCard: '#e8e8e8',
    borderInput: '#d9d9d9',
    borderInputFocus: '#1890ff',
    
    // الأيقونات (Icons)
    iconPrimary: '#595959',
    iconSecondary: '#8c8c8c',
    iconHover: '#1890ff',
    iconActive: '#2f54eb',
    
    // الأزرار (Buttons) - جميع الألوان
    btnPrimaryBg: '#1890ff',
    btnPrimaryHover: '#40a9ff',
    btnPrimaryActive: '#096dd9',
    btnDefaultBg: '#ffffff',
    btnDefaultBorder: '#d9d9d9',
    btnDefaultHover: '#f5f5f5',
    btnSuccessBg: '#52c41a',
    btnSuccessHover: '#73d13d',
    btnDangerBg: '#ff4d4f',
    btnDangerHover: '#ff7875',
    btnWarningBg: '#faad14',
    btnWarningHover: '#ffc53d',
    btnInfoBg: '#13c2c2',
    btnInfoHover: '#5cdbd3',
    btnPurpleBg: '#722ed1',
    btnPurpleHover: '#9254de',
    btnOrangeBg: '#fa8c16',
    btnOrangeHover: '#ffa940',
    btnPinkBg: '#eb2f96',
    btnPinkHover: '#f759ab',
    
    // الظلال (Shadows)
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    shadowCard: '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
    shadowTableHeader: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
    
    // السكرول بار (Scrollbar)
    scrollbarTrack: '#f5f5f5',
    scrollbarThumb: '#d9d9d9',
    scrollbarThumbHover: '#bfbfbf',
    
    // حالات خاصة (Special States)
    hoverBg: '#f5f5f5',
    activeBg: '#e6f7ff',
    disabledBg: '#f5f5f5',
    disabledText: '#bfbfbf',
    
    // تنسيق الجدول المخطط
    tableStripedBg: '#fafafa',
  },
  
  fonts: {
    main: 'Cairo, sans-serif',
    heading: 'Cairo-Bold, sans-serif',
    sizeXs: '11px',
    sizeSm: '12px',
    sizeMd: '14px',
    sizeLg: '16px',
    sizeXl: '18px',
    size2xl: '20px',
    size3xl: '24px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  transition: {
    fast: 'all 0.1s ease',
    normal: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
};

// ========== الثيم الداكن (Dark Mode) ==========
export const darkTheme = {
  mode: "dark",

  colors: {
    ...baseColors,

    // ===== Background =====
    bgPrimary: "#070B1A",
    bgSecondary: "#0D1326",
    bgTertiary: "#151C35",
    bgSidebar: "#080D1A",
    bgHeader: "#0D1326",
    bgCard: "#12182D",
    bgModal: "#12182D",
    bgDrawer: "#12182D",
    bgTable: "#12182D",
    bgTableHeader: "#1A2240",
    bgTableRowHover: "#1F2A4D",
    bgInput: "#1A2240",
    bgButton: "#1A2240",
    bgSelect: "#1A2240",

    // ===== Text =====
    textPrimary: "#FFFFFF",
    textSecondary: "#B9C2E3",
    textTertiary: "#8D96B5",
    textDisabled: "#5D678B",
    textPlaceholder: "#70789A",
    textLink: "#7A6BFF",
    textLinkHover: "#958BFF",
    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#FFFFFF",
    textOnDanger: "#FFFFFF",
    textOnTableHeader: "#FFFFFF",

    // ===== Borders =====
    borderPrimary: "#28345E",
    borderSecondary: "#202B4F",
    borderTable: "#28345E",
    borderCard: "#28345E",
    borderInput: "#28345E",
    borderInputFocus: "#7A6BFF",

    // ===== Icons =====
    iconPrimary: "#B9C2E3",
    iconSecondary: "#8D96B5",
    iconHover: "#7A6BFF",
    iconActive: "#00D5FF",

    // ===== Buttons (جميع الألوان) =====
    btnPrimaryBg: "#7A6BFF",
    btnPrimaryHover: "#958BFF",
    btnPrimaryActive: "#5D4CFF",
    btnDefaultBg: "#1A2240",
    btnDefaultBorder: "#28345E",
    btnDefaultHover: "#24305B",
    btnSuccessBg: "#00E0A4",
    btnSuccessHover: "#33E6B6",
    btnDangerBg: "#FF4D6D",
    btnDangerHover: "#FF708A",
    btnWarningBg: "#FFB547",
    btnWarningHover: "#FFC46A",
    btnInfoBg: "#00D5FF",
    btnInfoHover: "#33DEFF",
    btnPurpleBg: "#9B59B6",
    btnPurpleHover: "#AF7AC5",
    btnOrangeBg: "#E67E22",
    btnOrangeHover: "#EB984E",
    btnPinkBg: "#FD79A8",
    btnPinkHover: "#FDA7C4",

    // ===== Shadows =====
    shadowSm: "0 0 8px rgba(122,107,255,.12)",
    shadowMd: "0 0 15px rgba(122,107,255,.18)",
    shadowLg: "0 0 25px rgba(122,107,255,.22)",
    shadowXl: "0 0 40px rgba(122,107,255,.28)",
    shadowCard: "0 0 20px rgba(122,107,255,.10)",
    shadowTableHeader: "0 1px 0 0 rgba(122,107,255,.15)",

    // ===== Scroll =====
    scrollbarTrack: "#12182D",
    scrollbarThumb: "#33457A",
    scrollbarThumbHover: "#445B9C",

    // ===== States =====
    hoverBg: "#1F2A4D",
    activeBg: "#273664",
    disabledBg: "#151C35",
    disabledText: "#5D678B",
    
    // تنسيق الجدول المخطط
    tableStripedBg: "#161F3A",

    // ===== Extra Neon Colors =====
    accentPurple: "#7A6BFF",
    accentPurpleLight: "#958BFF",
    accentBlue: "#00D5FF",
    accentBlueLight: "#5EE7FF",
    successGlow: "#00E0A4",
    dangerGlow: "#FF4D6D",
    warningGlow: "#FFB547",
  },

  fonts: {
    main: "Cairo, sans-serif",
    heading: "Cairo-Bold, sans-serif",
    sizeXs: "11px",
    sizeSm: "12px",
    sizeMd: "14px",
    sizeLg: "16px",
    sizeXl: "18px",
    size2xl: "20px",
    size3xl: "24px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },

  borderRadius: {
    none: "0",
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "18px",
    full: "9999px",
  },

  transition: {
    fast: "all .15s ease",
    normal: "all .25s ease",
    slow: "all .35s ease",
  },
};