// // src/pages/LoginPage.jsx
// import { useState } from 'react';
// import { Form, Input, Button, Card, Select, message } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { useAuth } from '@/context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useTranslate } from '@/hooks/useTranslate';

// const LoginPage = () => {
//   const { t } = useTranslate();
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       // استدعاء API تسجيل الدخول
//       const response = await fetch('/api/Auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(values),
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         login(data.user, data.branch);
//         message.success(t('loginSuccess'));
//         navigate('/');
//       } else {
//         message.error(data.message || t('loginFailed'));
//       }
//     } catch (error) {
//       message.error(t('loginFailed'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-96 shadow-lg">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold">{t('login')}</h1>
//         </div>
//         <Form
//           name="login"
//           onFinish={onFinish}
//           layout="vertical"
//           size="large"
//         >
//           <Form.Item
//             name="username"
//             rules={[{ required: true, message: t('pleaseEnterUsername') }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder={t('username')} />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             rules={[{ required: true, message: t('pleaseEnterPassword') }]}
//           >
//             <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
//           </Form.Item>

//           <Form.Item
//             name="branch"
//             rules={[{ required: true, message: t('pleaseSelectBranch') }]}
//           >
//             <Select
//               placeholder={t('selectBranch')}
//               options={[
//                 { value: 1, label: 'الفرع الرئيسي' },
//                 // جلب الفروع من API
//               ]}
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} block>
//               {t('login')}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;