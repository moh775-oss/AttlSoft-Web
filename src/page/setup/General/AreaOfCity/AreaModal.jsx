import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslate } from '@/hooks/useTranslate';
import { fetchCitiesByCountry } from '@/api/City';

const AreaModal = ({
  visible,
  onCancel,
  onSave,
  initialValues = null,
  loading = false,
  countries = [],
  cities = [],
}) => {
  const { t } = useTranslate();
  const [form] = Form.useForm();
  const isEdit = !!initialValues;
  const [filteredCities, setFilteredCities] = useState(cities);

  // تحديث قائمة المدن عند تغيير الدولة
  const handleCountryChange = async (countryId) => {
    if (countryId) {
      try {
        const data = await fetchCitiesByCountry(countryId);
        setFilteredCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setFilteredCities([]);
    }
    form.setFieldsValue({ cityId: undefined });
  };

  useEffect(() => {
    if (visible && initialValues) {
      // جلب مدن الدولة المختارة
      if (initialValues.countryId) {
        fetchCitiesByCountry(initialValues.countryId).then(data => {
          setFilteredCities(data);
        });
      }
    }
  }, [visible, initialValues]);

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
        // تحديث المدن عند التعديل
        if (initialValues.countryId) {
          fetchCitiesByCountry(initialValues.countryId).then(data => {
            setFilteredCities(data);
          });
        }
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
      title={isEdit ? t('editArea') : t('addArea')}
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
            onChange={handleCountryChange}
            options={countries.map(c => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>

        <Form.Item
          name="cityId"
          label={t('cityName')}
          rules={[{ required: true, message: t('pleaseSelectCity') }]}
        >
          <Select
            placeholder={t('selectCity')}
            size="large"
            showSearch
            optionFilterProp="children"
            options={filteredCities.map(c => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={t('areaName')}
            rules={[
              { required: true, message: t('pleaseEnterAreaName') },
              { min: 2, message: t('nameMustBeAtLeastTwoCharacters') },
            ]}
          >
            <Input placeholder={t('enterAreaName')} size="large" />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label={t('areaNameEn')}
          >
            <Input placeholder={t('enterAreaNameEn')} size="large" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AreaModal;