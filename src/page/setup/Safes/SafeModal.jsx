import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslate } from '@/hooks/useTranslate';
import { fetchBranches } from '@/api/Branch';

const SafeModal = ({
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
  const [searching, setSearching] = useState(false);

  // جلب الفروع
  const loadBranches = async () => {
    setSearching(true);
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setSearching(false);
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
      title={isEdit ? t('editSafe') : t('addSafe')}
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
          allBranches: false,
          ...initialValues,
        }}
      >
        <Form.Item
          name="name"
          label={t('safeName')}
          rules={[
            { required: true, message: t('pleaseEnterSafeName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input placeholder={t('enterSafeName')} size="large" />
        </Form.Item>

        

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
            placeholder={t('searchAndSelectBranch')}
            size="large"
            disabled={allBranches}
            showSearch
            optionFilterProp="children"
            loading={searching}
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

        <div className="text-xs text-gray-400 mt-2">
          {allBranches ? t('allBranchesSelected') : t('selectBranch')}
        </div>
      </Form>
    </Modal>
  );
};

export default SafeModal;