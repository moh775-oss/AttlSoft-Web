import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';
import { fetchBranches } from '@/api/Branch';

const StoreModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
}) => {
  const { t } = useTranslate();
  const [form] = Form.useForm();
  const isEdit = !!initialValues;
  const [branches, setBranches] = useState([]);
  const [allBranches, setAllBranches] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadBranches();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setAllBranches(initialValues.allBranches || false);
    } else if (visible) {
      form.resetFields();
      setAllBranches(false);
    }
  }, [visible, initialValues, form]);

  const handleAllBranchesChange = (checked) => {
    setAllBranches(checked);
    if (checked) {
      form.setFieldsValue({ branch: undefined });
    }
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
      title={isEdit ? t('editStore') : t('addStore')}
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
          isActive: true,
          allBranches: false,
          ...initialValues,
        }}
      >
        <Form.Item
          name="name"
          label={t('storeName')}
          rules={[
            { required: true, message: t('pleaseEnterStoreName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterStoreName')} size="large" />
        </Form.Item>

        
        <Form.Item
          name="manager"
          label={t('manager')}
        >
          <Input placeholder={t('enterManager')} size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label={t('phone')}
          >
            <Input placeholder={t('phone')} size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label={t('address')}
          >
            <Input placeholder={t('address')} size="large" />
          </Form.Item>
        </div>
        

       

        <Form.Item
          name="branch"
          label={t('branch')}
          rules={[
            {
              required: !allBranches,
              message: t('pleaseSelectBranch'),
            },
          ]}
        >
          <Select
            placeholder={t('selectBranch')}
            size="large"
            disabled={allBranches}
            showSearch
            optionFilterProp="children"
            loading={loadingBranches}
            notFoundContent={t('noBranchesFound')}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={branches.map(branch => ({
              value: branch.id,
              label: branch.name,
            }))}
          />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Form.Item
          name="allBranches"
          label={t('allBranches')}
          valuePropName="checked"
        >
          <Switch
            checked={allBranches}
            onChange={handleAllBranchesChange}
            checkedChildren={t('yes')}
            unCheckedChildren={t('no')}
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

        </div>

        

        {isEdit && (
          <div className="text-xs text-gray-400 mt-2">
            {t('editStoreNote')}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default StoreModal;