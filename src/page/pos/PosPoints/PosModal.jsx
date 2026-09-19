
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { ShopOutlined, InboxOutlined, BankOutlined } from '@ant-design/icons';
import { useTranslate } from '@/hooks/useTranslate';
import { fetchBranches } from '@/api/Branch';
import { getStoresByBranch } from '@/api/Store';

const { Option } = Select;

const PosModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
}) => {
  const { t } = useTranslate();
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;
  const [branches, setBranches] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const data = await fetchBranches();
      setBranches(data || []);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoadingBranches(false);
    }
  };

  const loadStores = async (branchId) => {
    if (!branchId) {
      setStores([]);
      return;
    }
    setLoadingStores(true);
    try {
      const result = await getStoresByBranch(branchId);
      if (result.success) {
        setStores(result.data || []);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          posName: initialValues.posName,
          branch: initialValues.branch,
          storeId: initialValues.storeId,
        });
        if (initialValues.branch) {
          loadStores(initialValues.branch);
        }
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleBranchChange = (value) => {
    form.setFieldsValue({ storeId: undefined });
    loadStores(value);
  };

  const handleCancel = () => {
    form.resetFields();
    setStores([]);
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
      title={isEdit ? t('editPos') : t('addPos')}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={isEdit ? t('edit') : t('add')}
      cancelText={t('cancel')}
      width={560}
      className="rtl-modal"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Form.Item
          name="posName"
          label={t('posName')}
          rules={[
            { required: true, message: t('pleaseEnterPosName') },
            { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
          ]}
        >
          <Input
            prefix={<ShopOutlined />}
            placeholder={t('enterPosName')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="branch"
          label={t('branch')}
          rules={[{ required: true, message: t('pleaseSelectBranch') }]}
        >
          <Select
            placeholder={t('selectBranch')}
            size="large"
            suffixIcon={<BankOutlined />}
            loading={loadingBranches}
            showSearch
            optionFilterProp="label"
            onChange={handleBranchChange}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </Form.Item>

        <Form.Item
          name="storeId"
          label={t('store')}
          rules={[{ required: true, message: t('pleaseSelectStore') }]}
        >
          <Select
            placeholder={t('selectStore')}
            size="large"
            suffixIcon={<InboxOutlined />}
            loading={loadingStores}
            disabled={!form.getFieldValue('branch')}
            showSearch
            optionFilterProp="label"
            notFoundContent={t('noStoresFound')}
            options={stores.map(s => ({ value: s.id, label: s.name }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PosModal;