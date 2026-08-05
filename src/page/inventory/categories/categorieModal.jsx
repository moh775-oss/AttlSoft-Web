// src/pages/Groups/GroupModal.jsx

import { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const GroupModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
}) => {
  const { t } = useTranslation();
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
      title={isEdit ? t('editGroup') : t('addGroup')}
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
          label={t('groupName')}
          rules={[
            { required: true, message: t('pleaseEnterGroupName') },
            { min: 2, message: t('groupNameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterGroupName')} size="large" />
        </Form.Item>

        
      </Form>
    </Modal>
  );
};  

export default GroupModal;