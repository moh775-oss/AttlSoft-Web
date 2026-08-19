import { useState, useEffect } from 'react';
import { Button, Tooltip, Card, Dropdown, Modal, Tag, Select } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import AreaModal from './AreaModal';
import { fetchAreas, fetchAreasByCountry, fetchAreasByCity, addArea, updateArea, deleteArea } from '@/api/AreaOfCity';
import { fetchCountries } from '@/api/Country';
import { fetchCities, fetchCitiesByCountry } from '@/api/City';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const AreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCountry, setFilterCountry] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
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
    try {
      let data;
      if (countryId) {
        data = await fetchCitiesByCountry(countryId);
      } else {
        data = await fetchCities();
      }
      setCities(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    }
  };

  const loadAreas = async (countryId = null, cityId = null) => {
    setLoading(true);
    try {
      let data;
      if (cityId) {
        data = await fetchAreasByCity(cityId);
      } else if (countryId) {
        data = await fetchAreasByCountry(countryId);
      } else {
        data = await fetchAreas();
      }

      // إضافة اسم الدولة والمدينة لكل منطقة
      const areasWithNames = data.map(area => ({
        ...area,
        countryName: countries.find(c => c.id === area.countryId)?.name || '',
        cityName: cities.find(c => c.id === area.cityId)?.name || '',
      }));
      setAreas(areasWithNames);
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

  useEffect(() => {
    if (countries.length > 0) {
      loadAreas(filterCountry, filterCity);
    }
  }, [countries, cities, filterCountry, filterCity]);

  const handleAdd = () => {
    setSelectedArea(null);
    setModalVisible(true);
  };

  const handleEdit = (area) => {
    loadAreas(filterCountry, filterCity).then(() => {
      setSelectedArea(area);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteArea(id);
      notify.success(t('deleteSuccess'));
      loadAreas(filterCountry, filterCity);
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedArea) {
        await updateArea(selectedArea.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addArea(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadAreas(filterCountry, filterCity);
    } catch (error) {
      notify.error(selectedArea ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCountryFilterChange = (value) => {
    setFilterCountry(value);
    setFilterCity(null); // إعادة تعيين فلتر المدينة
  };

  const handleCityFilterChange = (value) => {
    setFilterCity(value);
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
      label: t('areaName'),
      width: '25%',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'nameEn',
      label: t('areaNameEn'),
      width: '15%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'countryName',
      label: t('countryName'),
      width: '20%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'cityName',
      label: t('cityName'),
      width: '20%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      width: '10%',
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

  // خيارات الفلتر
  const countryFilterOptions = [
    { value: null, label: t('allCountries') },
    ...countries.map(c => ({ value: c.id, label: c.name })),
  ];

  const cityFilterOptions = [
    { value: null, label: t('allCities') },
    ...cities.map(c => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="p-4">
        <Card
        title={
            <div className="flex items-start  w-full">
                <span className="text-lg font-semibold">{t('filter')}</span>
            </div>
        }
        >
            <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <Select
                placeholder={t('filterByCountry')}
                allowClear
                
                style={{ width: 180 }}
                onChange={handleCountryFilterChange}
                options={countryFilterOptions}
                showSearch
                optionFilterProp="label" 
                size="middle"
              />
              <Select
                placeholder={t('filterByCity')}
                allowClear
                showSearch
                optionFilterProp="label" 
                style={{ width: 180 }}
                onChange={handleCityFilterChange}
                options={cityFilterOptions}
                size="middle"
                disabled={!filterCountry}
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
            <span className="text-lg font-semibold">{t('areas')}</span>
            <span className="text-sm text-gray-400">
            
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={areas}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('areasReport')}
          printFileName="areas-report"
          filters={false}
          showReload
          onReload={() => loadAreas(filterCountry, filterCity)}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <AreaModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedArea}
        loading={saving}
        countries={countries}
        cities={cities}
      />
    </div>
  );
};

export default AreasPage;