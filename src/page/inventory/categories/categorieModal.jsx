import { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const GroupModal = ({
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
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

 
  useEffect(() => {
    if (visible) {
      form.resetFields(); 
      
      if (initialValues) {
        const isActive = initialValues.isActive !== null && 
                         initialValues.isActive !== undefined ? 
                         initialValues.isActive : true;
        
        form.setFieldsValue({
          ...initialValues,
          isActive: isActive,
        });
      }
    }
  }, [visible, initialValues, form]); 

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      key={initialValues?.id || 'add'} 
      title={isEdit ? t('editGroup') : t('addGroup')}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={isEdit ? t('edit') : t('add')}
      cancelText={t('cancel')}
      width={600}
      className="rtl-modal"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        dir="rtl"
        initialValues={{
          isActive: true,
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

export default GroupModal;