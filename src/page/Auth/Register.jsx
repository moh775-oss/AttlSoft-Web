// src/page/Auth/Register.jsx
import { useState } from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { addTenant } from '@/api/Tenants';
import notify from '@/utils/notify';
import './Register.css';
import logo from '@/assets/logo.png';

const { Option } = Select;

const arabCountries = [
  { code: '+966', name: 'السعودية', flag: '🇸🇦', iso: 'SA' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪', iso: 'AE' },
  { code: '+20', name: 'مصر', flag: '🇪🇬', iso: 'EG' },
  { code: '+962', name: 'الأردن', flag: '🇯🇴', iso: 'JO' },
  { code: '+961', name: 'لبنان', flag: '🇱🇧', iso: 'LB' },
  { code: '+963', name: 'سوريا', flag: '🇸🇾', iso: 'SY' },
  { code: '+970', name: 'فلسطين', flag: '🇵🇸', iso: 'PS' },
  { code: '+964', name: 'العراق', flag: '🇮🇶', iso: 'IQ' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼', iso: 'KW' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭', iso: 'BH' },
  { code: '+968', name: 'عمان', flag: '🇴🇲', iso: 'OM' },
  { code: '+974', name: 'قطر', flag: '🇶🇦', iso: 'QA' },
  { code: '+967', name: 'اليمن', flag: '🇾🇪', iso: 'YE' },
  { code: '+249', name: 'السودان', flag: '🇸🇩', iso: 'SD' },
  { code: '+218', name: 'ليبيا', flag: '🇱🇾', iso: 'LY' },
  { code: '+216', name: 'تونس', flag: '🇹🇳', iso: 'TN' },
  { code: '+213', name: 'الجزائر', flag: '🇩🇿', iso: 'DZ' },
  { code: '+212', name: 'المغرب', flag: '🇲🇦', iso: 'MA' },
  { code: '+222', name: 'موريتانيا', flag: '🇲🇷', iso: 'MR' },
  { code: '+253', name: 'جيبوتي', flag: '🇩🇯', iso: 'DJ' },
  { code: '+252', name: 'الصومال', flag: '🇸🇴', iso: 'SO' },
  { code: '+297', name: 'جزر القمر', flag: '🇰🇲', iso: 'KM' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('trial');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (mode === 'trial') {
        notify.info('وضع تجريبي - سيتم حفظ البيانات محلياً');
        setTimeout(() => {
          notify.success('تم إنشاء المؤسسة التجريبية بنجاح');
          navigate('/login');
        }, 1000);
        return;
      }

      const tenantData = {
        companyName: values.companyName,
        ownerName: values.ownerName,
        email: values.email,
        phone: values.phone,
        countryCode: values.countryCode,
        address: values.address,
        city: values.city,
        country: values.country,
        tenantKey: `company_${Date.now()}`,
      };

      const result = await addTenant(tenantData);
      if (result.success) {
        notify.success('تم إنشاء المؤسسة بنجاح');
        const message = `مؤسسة جديدة\nالاسم: ${values.companyName}\nالمالك: ${values.ownerName}\nالبريد: ${values.email}\nالهاتف: ${values.phone}`;
        window.open(`https://wa.me/966555713183?text=${encodeURIComponent(message)}`, '_blank');
        navigate('/login');
      } else {
        notify.error(result.message || 'حدث خطأ أثناء إنشاء المؤسسة');
      }
    } catch (error) {
      notify.error('حدث خطأ أثناء إنشاء المؤسسة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header-section">
          <img src={logo} alt="Logo" className="register-logo" />
          <h1>أنشئ مؤسستك الآن</h1>
          <p>ابدأ رحلتك مع نظام أتل سوفت لإدارة المؤسسات</p>
          <div className="register-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>إدارة متكاملة للمؤسسة</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>نظام آمن ومستقر</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>دعم فني على مدار الساعة</span>
            </div>
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-form-wrapper">
            <h2>إنشاء مؤسسة جديدة</h2>
            <p>أدخل بيانات المؤسسة للتسجيل</p>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="register-form"
            >
              <div className="register-mode">
                <Button
                  type={mode === 'trial' ? 'primary' : 'default'}
                  onClick={() => setMode('trial')}
                  className={`mode-btn ${mode === 'trial' ? 'mode-active' : ''}`}
                >
                  تجريبي
                </Button>
                <Button
                  type={mode === 'live' ? 'primary' : 'default'}
                  onClick={() => setMode('live')}
                  className={`mode-btn ${mode === 'live' ? 'mode-active' : ''}`}
                >
                  فعلي
                </Button>
              </div>

              <Form.Item
                name="companyName"
                label="اسم المؤسسة"
                rules={[{ required: true, message: 'الرجاء إدخال اسم المؤسسة' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="أدخل اسم المؤسسة" className="register-input" />
              </Form.Item>

              <Form.Item
                name="ownerName"
                label="اسم صاحب المؤسسة"
                rules={[{ required: true, message: 'الرجاء إدخال اسم صاحب المؤسسة' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="أدخل اسم صاحب المؤسسة" className="register-input" />
              </Form.Item>

              <Form.Item
               
                name="email"
                label="البريد الإلكتروني"
                rules={[
                  { required: true, message: 'الرجاء إدخال البريد الإلكتروني' },
                  { type: 'email', message: 'الرجاء إدخال بريد إلكتروني صحيح' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="أدخل البريد الإلكتروني" className="register-input" />
              </Form.Item>

              <Form.Item
  name="phone"
  label="رقم الهاتف"
  rules={[{ required: true, message: 'الرجاء إدخال رقم الهاتف' }]}
>
  <div className="register-phone-wrapper">
    <Select
      name="countryCode"
      defaultValue="+966"
      className="register-country-code"
      popupClassName="register-country-dropdown"
      options={arabCountries.map(c => ({
        value: c.code,
        label: `${c.flag} ${c.code}`,
      }))}
    />

    <Input
  prefix={<PhoneOutlined />}
  placeholder="أدخل رقم الهاتف"
  className="register-input"
  inputMode="numeric"
  onKeyDown={(e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key) &&
      !(e.ctrlKey || e.metaKey)
    ) {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  }}
/>
  </div>
</Form.Item>

              <Form.Item name="address" label="العنوان">
                <Input placeholder="أدخل العنوان" className="register-input" />
              </Form.Item>

              

              <Form.Item name="tenantKey" hidden>
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="register-btn"
                >
                  {mode === 'trial' ? 'بدء التجربة' : 'إنشاء المؤسسة'}
                </Button>
              </Form.Item>
            </Form>

            <div className="register-footer">
              <p>لديك حساب؟ <Link to="/login">تسجيل الدخول</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;