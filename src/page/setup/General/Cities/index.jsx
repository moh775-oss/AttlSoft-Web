import { useState, useEffect } from 'react';
import { Button, Tooltip, Card, Dropdown, Modal, Tag, Select } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import CityModal from './CityModal';
import { fetchCities, fetchCitiesByCountry, addCity, updateCity, deleteCity } from '@/api/City';
import { fetchCountries } from '@/api/Country';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const CitiesPage = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCountry, setFilterCountry] = useState(null);
  const { t } = useTranslate();

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    }
  };

  const loadCities = async (countryId = null) => {
    setLoading(true);
    try {
      let data;
      if (countryId) {
        data = await fetchCitiesByCountry(countryId);
      } else {
        data = await fetchCities();
      }
      const citiesWithCountry = data.map(city => ({
        ...city,
        countryName: countries.find(c => c.id === city.countryId)?.name || '',
      }));
      setCities(citiesWithCountry);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      loadCities(filterCountry);
    }
  }, [countries, filterCountry]);

  const handleAdd = () => {
    setSelectedCity(null);
    setModalVisible(true);
  };

  const handleEdit = (city) => {
    setSelectedCity(city);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteCity(id);
      if (result.success) {
        notify.success(result.message || t('deleteSuccess'));
        loadCities(filterCountry);
      } else {
        notify.error(result.message || t('deleteError'));
      }
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      let result;
      if (selectedCity) {
        result = await updateCity(
          selectedCity.id,
          {
            cityId: selectedCity.id,
            cityName: values.cityName,
            cityNameEn: values.cityNameEn,
            countryId: values.countryId,
            branch: values.branch ?? 0,
            userId: values.userId ?? 0,
          }
        );
      } else {
        result = await addCity({
          cityName: values.cityName,
          cityNameEn: values.cityNameEn,
          countryId: values.countryId,
          branch: values.branch ?? 0,
          userId: values.userId ?? 0,
        });
      }

      if (result.success) {
        notify.success(result.message || (selectedCity ? t('updateSuccess') : t('saveSuccess')));
        setModalVisible(false);
        loadCities(filterCountry);
      } else {
        notify.error(result.message || (selectedCity ? t('updateError') : t('saveError')));
      }
    } catch (error) {
      notify.error(selectedCity ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilterCountry(value);
  };

  const columns = [
    {
      key: 'code',
      label: t('code'),
      width: '10%',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'name',
      label: t('cityName'),
      width: '30%',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'nameEn',
      label: t('cityNameEn'),
      width: '20%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'countryName',
      label: t('countryName'),
      width: '25%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      width: '15%',
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: t('edit'),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: t('delete'),
                danger: true,
              },
            ],
            onClick: ({ key }) => {
              if (key === 'edit') {
                handleEdit(record);
              } else {
                Modal.confirm({
                  title: t('confirmDelete'),
                  content: t('confirmDeleteMessage'),
                  okText: t('yesDelete'),
                  cancelText: t('cancel'),
                  okButtonProps: { danger: true },
                  onOk: () => handleDelete(record.id),
                  className: 'custom-delete-modal',
                  overlayClassName: 'custom-delete-overlay',
                });
              }
            },
          }}
        >
          <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} />
        </Dropdown>
      ),
    },
  ];

  const filterOptions = [
    { value: null, label: t('allCountries') },
    ...countries.map(c => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="p-4">
      <Card
        title={
          <div className="flex items-start w-full">
            <span className="text-lg font-semibold">{t('filter')}</span>
          </div>
        }
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Select
              placeholder={t('filterByCountry')}
              allowClear
              style={{ width: 200 }}
              onChange={handleFilterChange}
              options={filterOptions}
              showSearch
              optionFilterProp="label"
              size="middle"
            />
          </div>
        </div>
      </Card>

      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                {t('add')}
              </Button>
            </div>
            <span className="text-lg font-semibold">{t('cities')}</span>
            <span className="text-sm text-gray-400"></span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={cities}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('citiesReport')}
          printFileName="cities-report"
          filters={false}
          showReload
          onReload={() => loadCities(filterCountry)}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <CityModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedCity}
        loading={saving}
        countries={countries}
      />
    </div>
  );
};

export default CitiesPage;