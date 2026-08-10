import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const TaxModal = ({
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
      title={isEdit ? t('editTax') : t('addTax')}
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
          name="nameAr"
          label={t('taxNameAr')}
          rules={[
            { required: true, message: t('pleaseEnterTaxName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterTaxName')} size="large" />
        </Form.Item>

        <Form.Item
          name="nameEn"
          label={t('taxNameEnglish')}
        >
          <Input placeholder={t('taxNameEnglish')} size="large" />
        </Form.Item>

        <Form.Item
          name="taxPercent"
          label={t('taxRate')}
          rules={[
            { required: true, message: t('taxRate') },
            { type: 'number', min: 0, max: 100, message: t('taxPercentInvalid') },
          ]}
        >
          <InputNumber
            className="w-full"
            size="large"
            min={0}
            max={100}
            step={0.5}
            placeholder={t('enterTaxRate')}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="isDefault"
            label={t('taxDefault')}
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={t('yes')} 
              unCheckedChildren={t('no')} 
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label={t('status')}
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={t('active')} 
              unCheckedChildren={t('inactive')} 
            />
          </Form.Item>
        </div>

        {isEdit && (
          <div className="text-xs text-gray-400 mt-2">
            {t('editTaxNote')}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default TaxModal;