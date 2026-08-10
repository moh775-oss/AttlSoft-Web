import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
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
    if (!visible) form.resetFields();
  }, [visible, form]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
       form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  }

  return (
    <Modal
    key={initialValues?.id || 'add'} 
      title={isEdit ? t('editUnit') : t('addUnit')}
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
      </Form>
    </Modal>
  );
};

export default UnitModal;