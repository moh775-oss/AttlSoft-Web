// src/page/Auth/index.jsx
import { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, LoginOutlined, WhatsAppOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchBranches } from '@/api/Branch';
import axios from 'axios';
import { API_URL } from '@/config/api';
import notify from '@/utils/notify';
import './Auth.css';
import logo from '@/assets/logo.png';
import saudiVision from '@/assets/vision.jpeg';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/login?UserName=${values.username}&Password=${values.password}&branch=${values.branch}`,
        null,
        {
          headers: {
            'accept': '*/*',
          }
        }
      );

      const data = response.data;

      if (data.token) {
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
        notify.error(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      notify.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
      
      
        
        
        <div className="login-card-right">
          <div className="login-form-wrapper">
            <div className="login-header">
              <div className="login-icon-box">
                <LoginOutlined className="login-icon" />
              </div>
              <h1>تسجيل الدخول</h1>
              
            </div>

            <Form name="login" onFinish={onFinish} layout="vertical" size="large" className="login-form">
              
              
              <Form.Item 
                name="branch" 
                label="الفرع" 
                rules={[{ required: true, message: 'الرجاء اختيار الفرع' }]}
              >
                <Select
                  placeholder="اختر الفرع"
                  loading={loadingBranches}
                  prefix={<BankOutlined />}
                  options={branches.map(branch => ({ value: branch.id, label: branch.name }))}
                  showSearch
                  optionFilterProp="label"
                  className="login-select"
                />
              </Form.Item>

              
              <Form.Item 
                name="username" 
                label="اسم المستخدم" 
                rules={[
                  { required: true, message: 'الرجاء إدخال اسم المستخدم' }, 
                  { min: 3, message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="أدخل اسم المستخدم" 
                  className="login-input" 
                />
              </Form.Item>

              
              <Form.Item 
                name="password" 
                label="كلمة المرور" 
                rules={[
                  { required: true, message: 'الرجاء إدخال كلمة المرور' }, 
                  { min: 3, message: 'كلمة المرور يجب أن تكون 3 أحرف على الأقل' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="أدخل كلمة المرور" 
                  className="login-input" 
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block 
                  className="login-btn"
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-footer-text">
              <p> جميع الحقوق محفوظة 2026 © أتل سوفت</p>
            </div>
          </div>
        </div>

        <div className="login-card-left">
          <div className="login-card-left-bg">
            <div className="login-images-wrapper">
              
              
              <div className="login-logo-box">
                <img src={logo} alt="Company Logo" className="login-logo" />
              </div>
              <h1 className="login-company-name">
                <span>شركة</span>
                <span className="brand-blue">اتل</span>
                <span className="brand-yellow">سوفت</span>
              </h1>
              
     
              
              
              <div className="login-divider">
                <span className="login-divider-line" />
              </div>
              
              
              <div className="login-vision-box">
                <img src={saudiVision} alt="Saudi Vision 2030" className="login-vision"  />
                <p className="login-vision-text">رؤية المملكة العربية السعودية 2030</p>
              </div>
              
              
              <div className="login-social-links">
                <a 
                  href="https://wa.me/966555713183" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="login-social-link"
                >
                  <WhatsAppOutlined className="social-icon" />
                  واتساب
                </a>
                <a 
                  href="tel:+966555713183" 
                  className="login-social-link"
                >
                  <PhoneOutlined className="social-icon" />
                  اتصال
                </a>
                <a 
                  href="https://attlsoft.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="login-social-link"
                >
                  <GlobalOutlined className="social-icon " />
                  الموقع
                </a>
              </div>
              
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;