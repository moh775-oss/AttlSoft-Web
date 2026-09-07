// src/page/Auth/login.jsx
import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Checkbox } from 'antd';
import { MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { fetchBranches } from '@/api/Branch';
import { logins } from '@/api/login';
import { useTranslation } from 'react-i18next';
import notify from '@/utils/notify';
import './Login.css';
import logo from '@/assets/logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadBranches = async () => {
      setLoadingBranches(true);
      try {
        const data = await fetchBranches();
        setBranches(data);
      } catch (error) {
        console.error('Error loading branches:', error);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const onFinishStep1 = async (values) => {
    setLoading(true);
    try {
      setTimeout(() => {
        setCurrentStep(2);
        setLoading(false);
      }, 500);
    } catch (error) {
      notify.error('حدث خطأ');
      setLoading(false);
    }
  };

  const onFinishStep2 = async (values) => {
    setLoading(true);
    try {
      const response = await logins(
        values.username,
        values.password,
        values.branch,
        values.tenantKey
      );

      if (response.success && response.data?.token) {
        const data = response.data;
        login({
          userId: data.userid,
          username: data.username,
          fullname: data.fullname,
          userType: data.usertype,
          token: data.token,
        }, {
          branchId: values.branch,
        }, data.token);
        
        notify.success('تم تسجيل الدخول بنجاح');
        navigate('/', { replace: true });
      } else {
        notify.error(response.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      notify.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header-section">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1>{t('login')}</h1>
          <p>{t('welcomeBack')}</p>
        </div>

        {currentStep === 1 ? (
          <Form
            form={form}
            name="login_step1"
            onFinish={onFinishStep1}
            layout="vertical"
            className="login-form"
          >
            <div className="login-method-tabs">
              <Button 
                type={loginMethod === 'email' ? 'primary' : 'default'}
                onClick={() => setLoginMethod('email')}
                className="method-btn"
                block
              >
                <MailOutlined /> {t('email')}
              </Button>
              <Button 
                type={loginMethod === 'phone' ? 'primary' : 'default'}
                onClick={() => setLoginMethod('phone')}
                className="method-btn"
                block
              >
                <PhoneOutlined /> {t('phone')}
              </Button>
            </div>

            {loginMethod === 'email' ? (
              <>
                <Form.Item
                  name="email"
                  label={t('email')}
                  rules={[
                    { required: true, message: t('pleaseEnterEmail') },
                    { type: 'email', message: t('pleaseEnterValidEmail') }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder={t('enterEmail')} className="login-input" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={t('password')}
                  rules={[{ required: true, message: t('pleaseEnterPassword') }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder={t('pleaseEnterPassword')} className="login-input" />
                </Form.Item>
              </>
            ) : (
              <Form.Item
                name="phone"
                label={t('phone')}
                rules={[{ required: true, message: t('phoneRequired') }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder={t('phoneRequired')} className="login-input" />
              </Form.Item>
            )}

            <div className="login-options">
              <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
                {t('remember_me')}
              </Checkbox>
              <div className="login-language">
                <Button 
                  type={i18n.language === 'ar' ? 'primary' : 'text'} 
                  onClick={() => handleLanguageChange('ar')}
                  className="lang-btn"
                >
                  عربي
                </Button>
                <Button 
                  type={i18n.language === 'en' ? 'primary' : 'text'} 
                  onClick={() => handleLanguageChange('en')}
                  className="lang-btn"
                >
                  English
                </Button>
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className="login-btn">
                {t('next')}
              </Button>
            </Form.Item>

            <div className="login-footer">
  <span>{t('noAccount')}</span>
  <Link to="/register">{t('createAccount')}</Link>
</div>
          </Form>
        ) : (
          <Form
            form={form}
            name="login_step2"
            onFinish={onFinishStep2}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="branch"
              label={t('branch')}
              rules={[{ required: true, message: t('pleaseSelectBranch') }]}
            >
              <Select
                placeholder={t('selectBranch')}
                loading={loadingBranches}
                className="login-select"
                options={branches.map(branch => ({ value: branch.id, label: branch.name }))}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              name="fiscalYear"
              label={t('fiscalYear')}
              rules={[{ required: true, message: t('pleaseSelectFiscalYear') }]}
            >
              <Select
                placeholder={t('selectFiscalYear')}
                className="login-select"
                options={[
                  { value: 2024, label: '2024' },
                  { value: 2025, label: '2025' },
                  { value: 2026, label: '2026' },
                ]}
              />
            </Form.Item>

            <Form.Item name="tenantKey" hidden>
              <Input />
            </Form.Item>

            <div className="login-step-nav">
              <Button onClick={() => setCurrentStep(1)} className="back-btn">
                {t('back')}
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} className="login-btn">
                {t('login')}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;