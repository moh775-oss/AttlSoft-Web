import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const OmlatModal = ({
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
      form.setFieldsValue({
        isDefault: false,
        exchangeRate: 1,
      });
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
      title={isEdit ? t('editCurrency') : t('addCurrency')}
      open={visible}
      onCancel={onCancel}
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
          isDefault: false,
          exchangeRate: 1,
          ...initialValues,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="nameAr"
            label={t('currencyNameAr')}
            rules={[
              { required: true, message: t('pleaseEnterCurrencyNameAr') },
              { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
            ]}
          >
            <Input placeholder={t('enterCurrencyNameAr')} size="large" />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label={t('currencyNameEn')}
            rules={[
              { required: true, message: t('pleaseEnterCurrencyNameEn') },
              { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
            ]}
          >
            <Input placeholder={t('enterCurrencyNameEn')} size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="code"
            label={t('currencyCode')}
            rules={[
              { required: true, message: t('pleaseEnterCurrencyCode') },
              { max: 3, message: t('currencyCodeMaxLength') },
            ]}
          >
            <Input placeholder={t('enterCurrencyCode')} size="large" maxLength={3} />
          </Form.Item>

          <Form.Item
            name="symbol"
            label={t('currencySymbol')}
            rules={[
              { required: true, message: t('pleaseEnterCurrencySymbol') },
            ]}
          >
            <Input placeholder={t('enterCurrencySymbol')} size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="exchangeRate"
          label={t('exchangeRate')}
          rules={[
            { required: true, message: t('pleaseEnterExchangeRate') },
            { type: 'number', min: 0, message: t('exchangeRateMin') },
          ]}
        >
          <InputNumber
            className="w-full"
            size="large"
            min={0}
            step={0.0001}
            placeholder={t('enterExchangeRate')}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="fractionNameAr"
            label={t('fractionNameAr')}
          >
            <Input placeholder={t('enterFractionNameAr')} size="large" />
          </Form.Item>

          <Form.Item
            name="fractionNameEn"
            label={t('fractionNameEn')}
          >
            <Input placeholder={t('enterFractionNameEn')} size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label={t('description')}
        >
          <Input.TextArea placeholder={t('enterDescription')} rows={2} size="large" />
        </Form.Item>

        <Form.Item
          name="isDefault"
          label={t('defaultCurrency')}
          valuePropName="checked"
        >
          <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
        </Form.Item>

        {isEdit && (
          <div className="text-xs text-gray-400 mt-2">
            {t('editCurrencyNote')}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default OmlatModal;