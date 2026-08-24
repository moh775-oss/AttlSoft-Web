import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const BankModal = ({
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
      if (initialValues) {
        form.setFieldsValue({
          bankName: initialValues.bankName,
          branchName: initialValues.branchName,
          accType: initialValues.accType,
        });
      } else {
        form.resetFields();
      }
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

  const accountTypes = [
    { value: 'جاري', label: 'جاري' },
    { value: 'توفير', label: 'توفير' },
    { value: 'استثماري', label: 'استثماري' },
  ];

  return (
    <Modal
      key={initialValues?.id || 'add'}
      title={isEdit ? t('editBank') : t('addBank')}
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
          name="bankName"
          label={t('bankName')}
          rules={[
            { required: true, message: t('pleaseEnterBankName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterBankName')} size="large" />
        </Form.Item>

        <Form.Item
          name="branchName"
          label={t('branchName')}
          rules={[
            { required: true, message: t('pleaseEnterBranchName') },
          ]}
        >
          <Input placeholder={t('enterBranchName')} size="large" />
        </Form.Item>
      
        <Form.Item
          name="accType"
          label={t('accountType')}
          rules={[
            { required: true, message: t('pleaseSelectAccountType') },
          ]}
        >
          <Select
            placeholder={t('selectAccountType')}
            size="large"
            options={accountTypes.map(type => ({ value: type.value, label: type.label }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BankModal;