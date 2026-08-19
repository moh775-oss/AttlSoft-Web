import { useState, useEffect } from 'react';
import { Button, Tooltip, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import CountryModal from './CountryModal';
import { fetchCountries, addCountry, updateCountry, deleteCountry } from '@/api/Country';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const CountriesPage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();

  const loadCountries = async () => {
    setLoading(true);
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleAdd = () => {
    setSelectedCountry(null);
    setModalVisible(true);
  };

  const handleEdit = (country) => {
    loadCountries().then(() => {
      setSelectedCountry(country);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCountry(id);
      notify.success(t('deleteSuccess'));
      loadCountries();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedCountry) {
        await updateCountry(selectedCountry.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addCountry(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadCountries();
    } catch (error) {
      notify.error(selectedCountry ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
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
      label: t('countryName'),
      width: '25%',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'nameEn',
      label: t('countryNameEn'),
      width: '20%',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'countryCode',
      label: t('countryCode'),
      width: '15%',
      sortable: true,
      render: (value) => <span className="font-mono">{value || '—'}</span>,
    },
    {
      key: 'phoneCode',
      label: t('phoneCode'),
      width: '15%',
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

  return (
    <div className="p-4">
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {t('add')}
            </Button>
            <span className="text-lg font-semibold">{t('countries')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={countries}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('countriesReport')}
          printFileName="countries-report"
          filters={false}
          showReload
          onReload={loadCountries}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <CountryModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedCountry}
        loading={saving}
      />
    </div>
  );
};

export default CountriesPage;