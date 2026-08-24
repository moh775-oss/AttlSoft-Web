import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
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
  const [searching, setSearching] = useState(false);
  const [allBranchesChecked, setAllBranchesChecked] = useState(false);

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
    if (visible) {
      if (initialValues) {
        // تعيين القيم عند التعديل
        const isAllBranches = initialValues.allBranches || false;
        setAllBranchesChecked(isAllBranches);
        
        form.setFieldsValue({
          name: initialValues.name,
          allBranches: isAllBranches,
          branch: isAllBranches ? undefined : (initialValues.branchId || initialValues.branch),
        });
      } else {
        // إضافة جديدة
        setAllBranchesChecked(false);
        form.resetFields();
        form.setFieldsValue({ allBranches: false });
      }
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    setAllBranchesChecked(false);
    onCancel();
  };

  const handleAllBranchesChange = (checked) => {
    setAllBranchesChecked(checked);
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
      key={initialValues?.id || 'add'}
      title={isEdit ? t('editSafe') : t('addSafe')}
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
            checked={allBranchesChecked}
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
              required: !allBranchesChecked,
              message: t('pleaseSelectBranch'),
            },
          ]}
        >
          <Select
            placeholder={t('searchAndSelectBranch')}
            size="large"
            disabled={allBranchesChecked}
            showSearch
            optionFilterProp="label"
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
          {allBranchesChecked ? t('allBranchesSelected') : t('selectBranch')}
        </div>
      </Form>
    </Modal>
  );
};

export default SafeModal;