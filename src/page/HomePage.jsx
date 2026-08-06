import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Dropdown, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '/src/App.css';
import { 
  PhoneOutlined, 
  MoreOutlined, 
  UserOutlined, 
  ShopOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export default function HomePage() { 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  
  const isRightToLeft = i18n.language === 'ar';
  
  const username = localStorage.getItem('username') || 'محمد عبدالحكيم قائد ';
  const branchName = localStorage.getItem('branchName') ||'فرع الرياض - الرئيسي - شارع العليا الفرعي';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setIsVisible(true);
  }, [i18n.language]);

  const visionTexts = [
    { id: 1, text: t('vision.1') },
    { id: 2, text: t('vision.2') },
    { id: 3, text: t('vision.3') },
    { id: 4, text: t('vision.4') },
    { id: 5, text: t('vision.5') }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); 
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % visionTexts.length); 
        setIsVisible(true); 
      }, 1000); 
    }, 60000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  const erpCards = [
    { id: 1, title: t('sales'), icon: '/icon/invoice.png', path: '/sales/operations/invoice' },
    { id: 2, title: t('purchase'), icon: '/icon/shopping-list.png', path: '/purchase/operations/invoice' },
    { id: 3, title: t('items'), icon: '/icon/categories.png', path: '/inventory/setup/items' },
    { id: 4, title: t('salesReturn'), icon: '/icon/purchase-history (1).png', path: '/sales/operations/return' },
    { id: 5, title: t('purchaseReturn'), icon: '/icon/shopping.png', path: '/purchase/operations/return' },
    { id: 6, title: t('accountStatement'), icon: '/icon/financial-statement.png', path: '/accounts/reports/trial-balance' },
    { id: 7, title: t('customer'), icon: '/icon/consumer-behavior.png', path: '/sales/setup/customers' },
    { id: 8, title: t('suppliers'), icon: '/icon/supplier.png', path: '/purchase/setup/suppliers' },
    { id: 9, title: t('receiptVoucher'), icon: '/icon/bill.png', path: '/accounts/operations/receipt-voucher' },
    { id: 10, title: t('paymentVoucher'), icon: '/icon/financial-statement (1).png', path: '/accounts/operations/payment-voucher' },
    { id: 11, title: t('journalEntry'), icon: '/icon/bank.png', path: '/accounts/operations/journal-entry' },
    { id: 12, title: t('dailyReport'), icon: '/icon/economy.png', path: '/sales/reports/sales-report' },
  ];

  const formattedDate = currentTime.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div 
      className={`home-page ${isDarkMode ? 'dark-home' : 'light-home'}`} 
      dir={isRightToLeft ? "rtl" : "ltr"}
      key={i18n.language}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* المحتوى الرئيسي - قابل للتمرير */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: '70px' }}>
        <div className="vision-ticker">
          <div className="ticker-container">
            <div className="ticker-logo">
              <div className="logo-mini">
                <img src="/image/attlsoft/logo.png" alt="أتل" />
              </div>
            </div>

            <div className="ticker-content">
              <div className={`ticker-text ${isVisible ? 'visible' : 'hidden'}`}>
                <span className="animated-text">
                  {visionTexts[currentIndex].text}
                </span>
              </div>
            </div>

            <div className="ticker-support">
              <PhoneOutlined className="support-icon" />
              <span className="support-number">+966 55 571 3183</span>
            </div>
          </div>
        </div>

        <Row gutter={[32, 32]} className="main-row" style={{ padding: '20px' }}>
          <Col xs={24} lg={8} className="images-col">
            <div className="images-container">
              <div className="vision-image">
                <img 
                  src="/image/img/vision.jpeg" 
                  alt="رؤية السعودية 2030"
                  className="vision-logo"
                />
              </div>
              <div className="vision-image">
                <img 
                  src="/image/img/zatka.png" 
                  alt="هيئة الزكاة والضريبة والجمارك"
                  className="vision-logo"
                />
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16} className="cards-col">
            <Row gutter={[16, 16]} className="cards-grid">
              {erpCards.map(card => (
                <Col xs={12} sm={8} md={8} lg={8} xl={6} key={card.id}>
                  <Card
                    hoverable
                    className="mini-card"
                    onClick={() => navigate(card.path)}
                    bodyStyle={{ padding: '20px 12px' }}
                  >
                    <div className="mini-card-content">
                      <div className="mini-card-icon">
                        <img src={card.icon} alt={card.title} />
                      </div>
                      <Text className="mini-card-title">
                        {card.title}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>

      {/* الشريط السفلي الثابت */}
      <div 
        className={`bottom-navbar ${isDarkMode ? 'dark-navbar' : 'light-navbar'}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65px',
          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
          borderTop: `1px solid ${isDarkMode ? '#333' : '#e8e8e8'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 25px',
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          direction: isRightToLeft ? 'rtl' : 'ltr'
        }}
      >
        {/* جهة اليمين - اسم الفرع (دائماً ظاهر) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShopOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span style={{ 
            color: isDarkMode ? '#fff' : '#333', 
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 'bold'
          }}>
            {branchName}
          </span>
        </div>

        {/* جهة اليسار - تعتمد على حجم الشاشة */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isMobile ? (
            // الشاشة الكبيرة: كل شيء يظهر
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                <span style={{ color: isDarkMode ? '#fff' : '#333', fontSize: '16px' }}>
                  {username}
                </span>
              </div>
              
              <div style={{ width: '1px', height: '30px', backgroundColor: isDarkMode ? '#333' : '#e8e8e8' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                <span style={{ color: isDarkMode ? '#fff' : '#333', fontSize: '15px' }}>
                  {formattedDate}
                </span>
                <span style={{ 
                  color: '#1890ff', 
                  fontSize: '17px', 
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  minWidth: '75px'
                }}>
                  {formattedTime}
                </span>
              </div>
            </>
          ) : (
            // الشاشة الصغيرة: اسم الفرع + ثلاث نقاط - باستخدام menu
            <Dropdown
              trigger={['click']}
              placement="topRight"
              menu={{
                items: [
                  {
                    key: 'user',
                    icon: <UserOutlined />,
                    label: (
                      <div>
                        <strong>المستخدم:</strong> {username}
                      </div>
                    ),
                  },
                  {
                    key: 'datetime',
                    icon: <ClockCircleOutlined />,
                    label: (
                      <div>
                        <div>{formattedDate}</div>
                        <div style={{ color: '#1890ff', fontWeight: 'bold' }}>
                          {formattedTime}
                        </div>
                      </div>
                    ),
                  },
                ],
              }}
            >
              <Button 
                type="text" 
                icon={<MoreOutlined style={{ fontSize: 24 }} />}
                style={{ 
                  color: isDarkMode ? '#fff' : '#333',
                  padding: '0 5px',
                  height: '45px',
                  width: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}