import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';

const BranchModal = ({
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
      title={isEdit ? t('editBranch') : t('addBranch')}
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
          ...initialValues,
        }}
      >
        <Form.Item
          name="name"
          label={t('branchName')}
          rules={[
            { required: true, message: t('pleaseEnterBranchName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('branchName')} size="large" />
        </Form.Item>

        <Form.Item
          name="address"
          label={t('address')}
        >
          <Input.TextArea 
            placeholder={t('address')} 
            rows={2}
            size="large"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label={t('phone')}
          >
            <Input placeholder={t('phone')} size="large" />
          </Form.Item>

          <Form.Item
            name="manager"
            label={t('manager')}
          >
            <Input placeholder={t('manager')} size="large" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default BranchModal;