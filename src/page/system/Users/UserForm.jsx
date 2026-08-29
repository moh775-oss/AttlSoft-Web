
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Select, Switch, Row, Col, Divider, Tabs, Space, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslate } from '@/hooks/useTranslate';
import { getUserById, createUser, updateUser } from '@/api/User';
import { fetchBranches } from '@/api/Branch';
import notify from '@/utils/notify';

const { TabPane } = Tabs;
const { Option } = Select;

const UserForm = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);
  const [userTypes] = useState(['Admin', 'User', 'Manager', 'Accountant']);
  const isEdit = !!id;

  // جلب الفروع
  const loadBranches = async () => {
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  // جلب بيانات المستخدم للتعديل
  const loadUser = async () => {
    if (!isEdit) return;
    
    setLoading(true);
    try {
      const user = await fetchUserById(id);
      if (user) {
        form.setFieldsValue({
          userName: user.userName,
          fullName: user.fullName,
          userEmail: user.userEmail,
          userType: user.userType,
          branchId: user.branchId,
          roleStatus: user.roleStatus,
          // الصلاحيات
          branch: user.branch,
          settings: user.settings,
          cat: user.cat,
          unit: user.unit,
          addPrd: user.addPrd,
          prdManage: user.prdManage,
          prdManageStore: user.prdManageStore,
          store: user.store,
          transferStore: user.transferStore,
          transferManage: user.transferManage,
          sale: user.sale,
          reSale: user.reSale,
          saleManage: user.saleManage,
          reSaleManage: user.reSaleManage,
          buy: user.buy,
          reBuy: user.reBuy,
          buyManage: user.buyManage,
          reBuyManage: user.reBuyManage,
          barcode1: user.barcode1,
          barcode2: user.barcode2,
          customer: user.customer,
          supplier: user.supplier,
          supplierAccount: user.supplierAccount,
          paidManage: user.paidManage,
          logs: user.logs,
          pos: user.pos,
          users: user.users,
          qabdManage: user.qabdManage,
          allMoves: user.allMoves,
          expenseType: user.expenseType,
          expense: user.expense,
          addEmp: user.addEmp,
          job: user.job,
          dep: user.dep,
          salary: user.salary,
          empManage: user.empManage,
          records: user.records,
          dbBackRestore: user.dbBackRestore,
          expdate: user.expdate,
          rolesManage: user.rolesManage,
        });
      }
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    loadUser();
  }, []);

  // التحقق من كلمة المرور
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error(t('pleaseEnterPassword')));
    }
    if (value.length < 3) {
      return Promise.reject(new Error(t('passwordTooShort')));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    const password = form.getFieldValue('password');
    if (!value) {
      return Promise.reject(new Error(t('pleaseConfirmPassword')));
    }
    if (value !== password) {
      return Promise.reject(new Error(t('passwordMismatch')));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const userData = {
        ...values,
        // إذا لم يتم تغيير كلمة المرور في التعديل، لا نرسلها
        password: values.password || '',
      };

      let result;
      if (isEdit) {
        result = await updateUser(id, userData);
      } else {
        result = await addUser(userData);
      }

      if (result.success) {
        notify.success(isEdit ? t('updateSuccess') : t('saveSuccess'));
        // رجوع بدون تخزين في التاريخ
        navigate('/setup/users', { replace: true });
      } else {
        notify.error(result.message || (isEdit ? t('updateError') : t('saveError')));
      }
    } catch (error) {
      notify.error(isEdit ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/setup/users', { replace: true });
  };



  return (
    <div className="p-4">
      <Card
        loading={loading}
        title={
          <div className="flex items-center justify-between w-full">
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                {t('back')}
              </Button>
              <span className="text-lg font-semibold">
                {isEdit ? t('editUser') : t('addUser')}
              </span>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          dir="rtl"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="userName"
                label={t('userName')}
                rules={[{ required: true, message: t('pleaseEnterUsername') }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder={t('enterUsername')} 
                  size="large" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label={t('fullName')}
                rules={[{ required: true, message: t('pleaseEnterFullName') }]}
              >
                <Input 
                  placeholder={t('enterFullName')} 
                  size="large" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="userEmail"
                label={t('email')}
                rules={[
                  { type: 'email', message: t('pleaseEnterValidEmail') }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder={t('enterEmail')} 
                  size="large" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="userType"
                label={t('userType')}
                rules={[{ required: true, message: t('selectUserType') }]}
              >
                <Select placeholder={t('selectUserType')} size="large">
                  {userTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label={t('password')}
                rules={[
                  { validator: validatePassword }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder={isEdit ? t('leaveBlankToKeep') : t('enterPassword')} 
                  size="large" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label={t('confirmPassword')}
                dependencies={['password']}
                rules={[
                  { validator: validateConfirmPassword }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder={t('confirmPassword')} 
                  size="large" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="branchId"
                label={t('branch')}
                rules={[{ required: true, message: t('selectBranch') }]}
              >
                <Select placeholder={t('selectBranch')} size="large">
                  {branches.map(branch => (
                    <Option key={branch.id} value={branch.id}>{branch.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="roleStatus"
                label={t('roleStatus')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('active')} 
                  unCheckedChildren={t('inactive')} 
                  defaultChecked 
                />
              </Form.Item>
            </Col>
          </Row>

          

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={saving} 
                size="large"
              >
                {t('save')}
              </Button>
              <Button onClick={handleBack} size="large">
                {t('cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserForm;