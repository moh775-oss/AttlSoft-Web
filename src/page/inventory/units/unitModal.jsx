// src/pages/Units/UnitModal.jsx

import { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Switch } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const UnitModal = ({
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
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

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
      title={isEdit ? t('editUnit') : t('addUnit')}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={isEdit ? t('edit') : t('add')}
      cancelText={t('cancel')}
      width={600}
      className="rtl-modal"
    >
      <Form
        form={form}
        layout="vertical"
        dir="rtl"
        initialValues={{
          isActive: true,
          ...initialValues,
        }}
      >
        <Form.Item
          name="name"
          label={t('unitName')}
          rules={[
            { required: true, message: t('pleaseEnterUnitName') },
            { min: 2, message: t('unitNameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterUnitName')} size="large" />
        </Form.Item>

        <Form.Item
          name="code"
          label={t('unitCode')}
          rules={[
            { required: true, message: t('pleaseEnterUnitCode') },
          ]}
        >
          <Input placeholder={t('enterUnitCode')} size="large" disabled />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description')}
        >
          <Input.TextArea 
            placeholder={t('enterDescription')} 
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={t('active')}
          valuePropName="checked"
        >
          <Switch 
            checkedChildren={t('yes')} 
            unCheckedChildren={t('no')} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UnitModal;