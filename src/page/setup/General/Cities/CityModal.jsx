import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const CityModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
  countries = [],
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
      if (initialValues) {
        form.setFieldsValue(initialValues);
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
      title={isEdit ? t('editCity') : t('addCity')}
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
        <Form.Item
          name="countryId"
          label={t('countryName')}
          rules={[{ required: true, message: t('pleaseSelectCountry') }]}
        >
          <Select
            placeholder={t('selectCountry')}
            size="large"
            showSearch
            optionFilterProp="children"
            options={countries.map(c => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={t('cityName')}
            rules={[
              { required: true, message: t('pleaseEnterCityName') },
              { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
            ]}
          >
            <Input placeholder={t('enterCityName')} size="large" />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label={t('cityNameEn')}
          >
            <Input placeholder={t('enterCityNameEn')} size="large" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CityModal;