import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Button, Tooltip } from 'antd';
import {
  ShopOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  SettingOutlined,
  DollarOutlined,
  HomeOutlined,
  BuildOutlined,
  BarChartOutlined,
  MenuOutlined,
  LogoutOutlined,
  MoreOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useTranslate } from './hooks/useTranslate';
import { useTranslation } from 'react-i18next';
import './ERPTopNav.css';

const { Header } = Layout;

export default function ERPTopNav() { // إزالة props
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, changeLanguage } = useTranslate();
  const { i18n } = useTranslation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  // جلب الاتجاه الحالي من i18n
  const isRightToLeft = i18n.language === 'ar';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLayout = () => {
  const newLang = isRightToLeft ? 'en' : 'ar';

  changeLanguage(newLang);

  localStorage.setItem('language', newLang);

  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = newLang;
};

  const handleLogout = () => {
    console.log('تسجيل الخروج');
    navigate('/login');
  };

  const arabicMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: t('home'),
      onClick: () => { navigate('/'); setDrawerVisible(false); }
    },
    {
      label: t('setup'),
      key: 'setup',
      icon: <BuildOutlined />,
      children: [
        { label: t('companyInfo'), key: '/setup/company' },
        { label: t('branches'), key: '/setup/branches' },
        { label: t('manageBanks'), key: '/setup/banks' },
        { label: t('safes'), key: '/setup/safes' },
        { label: t('taxes'), key: '/setup/taxes' },
        {label: t('currencies'), key: '/setup/omlats'},
        {
          label: t('zakat'),
          key: 'setup_zatca',
          children: [
            { label: t('zatcaConnection'), key: '/setup/zatca/connection' },
            { label: t('vatReport'), key: '/setup/zatca/vat-report' },
            { label: t('vatReturn'), key: '/setup/zatca/vat-return' },
          ],
        },

        { label: t('settings'), key: '/setup/settings' },
      ],
    },
    {
      label: t('inventory'),
      key: 'inventory',
      icon: <InboxOutlined />,
      children: [
        {
          label: t('setup'),
          key: 'inventory_setup',
          children: [
            { label: t('categories'), key: '/inventory/setup/categories' },
            { label: t('units'), key: '/inventory/setup/units' },
            { label: t('items'), key: '/inventory/setup/items' },
            { label: t('store'), key: '/inventory/setup/stores'},
            { label: t('stocktaking'), key: '/inventory/setup/stocktaking' },
          ]
        },
        {
          label: t('operations'),
          key: 'inventory_operations',
          children: [
            { label: t('inventoryTransfer'), key: '/inventory/operations/transfer' },
            { label: t('adjustment'), key: '/inventory/operations/adjust' },
            { label: t('physicalStock'), key: '/inventory/operations/stocktake' },
            { label: t('stockEntry'), key: '/inventory/operations/entry' },
            { label: t('stockExit'), key: '/inventory/operations/exit' },
          ]
        },
        {
          label: t('reports'),
          key: 'inventory_reports',
          children: [
            { label: t('movementReport'), key: '/inventory/reports/movement' },
            { label: t('itemCard'), key: '/inventory/reports/item-card' },
            { label: t('slowMoving'), key: '/inventory/reports/slow-moving' },
            { label: t('stockReport'), key: '/inventory/reports/stocktaking' },
            { label: t('criticalQuantities'), key: '/inventory/reports/critical-quantities' },
          ]
        },
      ],
    },
    {
      label: t('sales'),
      key: 'sales',
      icon: <ShopOutlined />,
      children: [
        {
          label: t('setup'),
          key: 'sales_setup',
          children: [
            { label: t('customers'), key: '/sales/setup/customers' },
            { label: t('agents'), key: '/sales/setup/products' },
            { label: t('importCustomers'), key: '/sales/setup/pricing' },
          ]
        },
        {
          label: t('operations'),
          key: 'sales_operations',
          children: [
            { label: t('invoice'), key: '/sales/operations/invoice' },
            { label: t('return'), key: '/sales/operations/return' },
            { label: t('orders'), key: '/sales/operations/orders' },
            { label: t('quotes'), key: '/sales/operations/quotes' },
            { label: t('collection'), key: '/sales/operations/collection' },
          ]
        },
        {
          label: t('reports'),
          key: 'sales_reports',
          children: [
            { label: t('dailyReport'), key: '/sales/reports/daily' },
            { label: t('customersReport'), key: '/sales/reports/customers' },
            { label: t('agentsReport'), key: '/sales/reports/agents' },
            { label: t('profitsReport'), key: '/sales/reports/profits' },
            { label: t('monthlyReport'), key: '/sales/reports/monthly' },
          ]
        },
      ],
    },
    {
      label: t('purchase'),
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      children: [
        {
          label: t('setup'),
          key: 'purchase_setup',
          children: [
            { label: t('suppliers'), key: '/purchase/setup/suppliers' },
            { label: t('purchaseRequests'), key: '/purchase/setup/requests' },
            { label: t('paymentTerms'), key: '/purchase/setup/terms' },
            { label: t('purchaseCategories'), key: '/purchase/setup/categories' },
          ]
        },
        {
          label: t('operations'),
          key: 'purchase_operations',
          children: [
            { label: t('purchaseInvoice'), key: '/purchase/operations/invoice' },
            { label: t('purchaseReturn'), key: '/purchase/operations/return' },
            { label: t('purchaseOrders'), key: '/purchase/operations/orders' },
            { label: t('supplierPayments'), key: '/purchase/operations/supplier-payments' },
          ]
        },
        {
          label: t('reports'),
          key: 'purchase_reports',
          children: [
            { label: t('purchaseMonthlyReport'), key: '/purchase/reports/monthly' },
            { label: t('suppliersReport'), key: '/purchase/reports/suppliers' },
            { label: t('paymentsReport'), key: '/purchase/reports/payments' },
            { label: t('purchaseByItemReport'), key: '/purchase/reports/by-item' },
          ]
        },
      ],
    },

    {
      label: t('accounts'),
      key: 'accounts',
      icon: <DollarOutlined />,
      children: [
        {
          label: t('setup'),
          key: 'accounts_setup',
          children: [
            { label: t('chartOfAccounts'), key: '/accounts/setup/chart' },
            { label: t('costCenters'), key: '/accounts/setup/cost-centers' },
            { label: t('bankAccounts'), key: '/accounts/setup/bank-accounts' },
            { label: t('periods'), key: '/accounts/setup/periods' },
          ]
        },
        {
          label: t('operations'),
          key: 'accounts_operations',
          children: [
            { label: t('journalEntry'), key: '/accounts/operations/journal' },
            { label: t('expenses'), key: '/accounts/operations/expenses' },
            { label: t('revenues'), key: '/accounts/operations/revenues' },
            { label: t('bank'), key: '/accounts/operations/bank' },
            { label: t('receivables'), key: '/accounts/operations/receivables' },
            { label: t('payables'), key: '/accounts/operations/payables' },
          ]
        },
        {
          label: t('reports'),
          key: 'accounts_reports',
          children: [
            { label: t('balanceSheet'), key: '/accounts/reports/balance-sheet' },
            { label: t('incomeStatement'), key: '/accounts/reports/income' },
            { label: t('cashFlow'), key: '/accounts/reports/cash-flow' },
            { label: t('profitLoss'), key: '/accounts/reports/profit-loss' },
            { label: t('trialBalance'), key: '/accounts/reports/trial-balance' },
          ]
        },
      ],
    },

    {
      label: t('system'),
      key: 'system',
      icon: <SettingOutlined />,
      children: [
        { label: t('users'), key: '/system/users' },
        { label: t('permissions'), key: '/system/permissions' },
        { label: t('systemSettings'), key: '/system/settings' },
        { label: t('backup'), key: '/system/backup' },
        { label: t('systemLogs'), key: '/system/logs' },
      ],
    },
    {
      label: t('reports'),
      key: 'reports',
      icon: <BarChartOutlined />,
      children: [
        { label: t('integratedReports'), key: '/reports/integrated' },
        { label: t('customReports'), key: '/reports/custom' },
        { label: t('dashboards'), key: '/reports/dashboards' },
        { label: t('performanceReports'), key: '/reports/performance' },
      ],
    },
  ];

  return (
    <Layout className="erp-layout" dir={isRightToLeft ? "rtl" : "ltr"}>
      <Header className={`erp-header ${isDarkMode ? 'dark-header' : 'light-header'}`}>
        {!isMobile && (
          <div className={`desktop-layout ${isRightToLeft ? 'rtl-mode' : 'ltr-mode'}`}>
            <div className="company-section">
              <div className="company-name">
                <span className="company-text">{t('appName')}</span>
              </div>
            </div>

            <div className="menu-center">
              <Menu
                mode="horizontal"
                theme={isDarkMode ? 'dark' : 'light'}
                items={arabicMenuItems}
                className="main-menu"
                triggerSubMenuAction={"click"}
                onClick={({ key }) => {
                  if (key && key.startsWith('/')) {
                    navigate(key);
                  }
                }}
                dir={isRightToLeft ? "rtl" : "ltr"}
                overflowedIndicator={<MoreOutlined />}
              />
            </div>

            <div className="icons-section">
              <div className="icons-container">

                <Tooltip title={isDarkMode ? t('lightMode') : t('darkMode')}>
                  <button
                    className="icon-btn theme-btn"
                    onClick={toggleTheme}
                  >
                    {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                  </button>
                </Tooltip>

                <Tooltip title={isRightToLeft ? t('english') : t('arabic')}>
                  <button
                    className="icon-btn lang-btn"
                    onClick={toggleLayout}
                  >
                    {isRightToLeft ? '🇺🇸' : '🇸🇦'}
                  </button>
                </Tooltip>

                <Tooltip title={t('logout')}>
                  <button
                    className="icon-btn logout-btn"
                    onClick={handleLogout}
                  >
                    <LogoutOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="mobile-layout">
            <div className="mobile-header">
              {isRightToLeft ? (
                <>
                  <div className="mobile-icons">

                    <button
                      className="mobile-icon-btn theme-mobile-btn"
                      onClick={toggleTheme}
                    >
                      {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    </button>
                    <button
                      className="mobile-icon-btn lang-mobile-btn"
                      onClick={toggleLayout}
                    >
                      🇺🇸
                    </button>
                    <button
                      className="mobile-icon-btn logout-mobile-btn"
                      onClick={handleLogout}
                    >
                      <LogoutOutlined />
                    </button>
                  </div>

                  <div className="mobile-brand">
                    <span className="mobile-company-name">{t('appName')}</span>
                  </div>

                  <Button
                    className="mobile-menu-btn"
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerVisible(true)}
                  />
                </>
              ) : (
                <>
                  <Button
                    className="mobile-menu-btn"
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerVisible(true)}
                  />

                  <div className="mobile-brand">
                    <span className="mobile-company-name">{t('appName')}</span>
                  </div>

                  <div className="mobile-icons">
                    <button
                      className="mobile-icon-btn logout-mobile-btn"
                      onClick={handleLogout}
                    >
                      <LogoutOutlined />
                    </button>
                    <button
                      className="mobile-icon-btn lang-mobile-btn"
                      onClick={toggleLayout}
                    >
                      🇸🇦
                    </button>
                    <button
                      className="mobile-icon-btn theme-mobile-btn"
                      onClick={toggleTheme}
                    >
                      {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Header>

      <Drawer
  title={
    <div className="drawer-title">
      <span className="drawer-company-name">
        {t('appName')}
      </span>
    </div>
  }
  placement={isRightToLeft ? "right" : "left"}
  onClose={() => setDrawerVisible(false)}
  open={drawerVisible}
  className={`mobile-drawer ${isDarkMode ? 'dark-drawer' : 'light-drawer'}`}
  width={280}
  // 🔥 هذه الخصائص هي الحل السحري 🔥
  push={false}  // يمنع دفع المحتوى الرئيسي نهائياً
  mask={true}   // يظهر الخلفية الداكنة
  maskClosable={true}  // يغلق عند الضغط على الخلفية
  closable={true}  // يظهر زر الإغلاق
>
  <div className="drawer-actions-horizontal">
    <button className="drawer-action-icon-btn theme-drawer-btn" onClick={toggleTheme}>
      {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
    </button>

    <button className="drawer-action-icon-btn lang-drawer-btn" onClick={toggleLayout}>
      {isRightToLeft ? '🇺🇸' : '🇸🇦'}
    </button>

    <button className="drawer-action-icon-btn logout-drawer-btn" onClick={handleLogout}>
      <LogoutOutlined />
    </button>
  </div>

  <Menu
    mode="vertical"
    theme={isDarkMode ? 'dark' : 'light'}
    items={arabicMenuItems}
    className="mobile-menu"
    onClick={({ key }) => {
      if (key && key.startsWith('/')) {
        navigate(key);
        setDrawerVisible(false);
      }
    }}
    dir={isRightToLeft ? "rtl" : "ltr"}
  />
</Drawer>
    </Layout>
  );
}