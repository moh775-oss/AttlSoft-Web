import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const CountryModal = ({
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
      title={isEdit ? t('editCountry') : t('addCountry')}
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
      <Form form={form} layout="vertical" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={t('countryName')}
            rules={[
              { required: true, message: t('pleaseEnterCountryName') },
              { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
            ]}
          >
            <Input placeholder={t('enterCountryName')} size="large" />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label={t('countryNameEn')}
          >
            <Input placeholder={t('enterCountryNameEn')} size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="countryCode"
            label={t('countryCode')}
            rules={[
              { required: true, message: t('pleaseEnterCountryCode') },
              { max: 3, message: t('countryCodeMaxLength') },
            ]}
          >
            <Input placeholder={t('enterCountryCode')} size="large" maxLength={3} />
          </Form.Item>

          <Form.Item
            name="phoneCode"
            label={t('phoneCode')}
          >
            <Input placeholder={t('enterPhoneCode')} size="large" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CountryModal;