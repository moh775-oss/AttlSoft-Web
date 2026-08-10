// src/pages/Suppliers/SupplierModal.jsx
import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Tabs, Space, Divider } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const { TabPane } = Tabs;

const SupplierModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
}) => {
  const { t } = useTranslate();
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

 

   useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        ...initialValues,
        branch: initialValues.branch || 1,
        debitLimit: initialValues.debitLimit || 0,
        balance: initialValues.balance || 0,
      });
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };


  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
    key={initialValues?.id || 'add'}
      title={isEdit ? t('editPurchaseSupplier') : t('addPurchaseSupplier')}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={isEdit ? t('edit') : t('add')}
      cancelText={t('cancel')}
      width={750}
      className="rtl-modal"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        dir="rtl"
       
      >
        {/* المعلومات الأساسية */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-600 mb-3">{t('infoBasic')}</h4>
           <Form.Item
              name="name"
              label={t('supplierName')}
              rules={[
                { required: true, message: t('required') },
                { min: 2, message: t('validation.minLength') },
              ]}
            >
              <Input placeholder={t('supplierName')} size="large" />
            </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           

            <Form.Item
              name="vatNo"
              label={t('vatNumber')}
              rules={[
                { pattern: /^[0-9]*$/, min: 15, max: 15, message: t('validation.number') },
              ]}
            >
              <Input placeholder={t('vatNumber')} size="large" />
            </Form.Item>
            <Form.Item name="bussnsNo" label={t('businessNumber')}>
              <Input placeholder={t('businessNumber')} />
            </Form.Item>
           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Form.Item
              name="phone"
              label={t('phone')}
              rules={[
                { pattern: /^[0-9+\-\s()]*$/, message: t('validation.phone') },
              ]}
            >
              <Input placeholder={t('phone')} size="large" />
            </Form.Item>

            <Form.Item
              name="accNo"
              label={t('account')}
              tooltip={t('automatic')}
            >
              <Input 
                placeholder={t('automatic')} 
                size="large" 
                disabled={!isEdit}
                className="bg-gray-50"
              />
            </Form.Item>
          </div>
        </div>

        <Divider />

        {/* العنوان */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-600 mb-3">{t('address')}</h4>
          <Form.Item name="address" label={t('address')}>
            <Input.TextArea placeholder={t('address')} rows={2} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="country" label={t('country')}>
              <Input placeholder={t('country')} />
            </Form.Item>

            <Form.Item name="city" label={t('city')}>
              <Input placeholder={t('city')} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="street" label={t('street')}>
              <Input placeholder={t('street')} />
            </Form.Item>

            <Form.Item name="buildNumber" label={t('buildingNumber')}>
              <Input placeholder={t('buildingNumber')} />
            </Form.Item>
          </div>

          <Form.Item name="areaLocation" label={t('areaLocation')}>
            <Input placeholder={t('areaLocation')} />
          </Form.Item>
        </div>

        <Divider />

        {/* المعلومات الإضافية */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-blue-600 mb-3">{t('info.suppliers.supplierInfo')}</h4>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="debitLimit" label={t('supplierCreditLimit')}>
              <InputNumber
                className="w-full"
                min={0}
                step={0.01}
                placeholder={t('supplierCreditLimit')}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item name="balance" label={t('balance')}>
              <InputNumber
                className="w-full"
                step={0.01}
                placeholder={t('enterBalance')}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            

           
            <Form.Item name="both" label={t('both')} valuePropName="checked">
              <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
            </Form.Item>
          </div>
          
        </div>

    
        <Form.Item name="address2" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="theCode" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierModal;