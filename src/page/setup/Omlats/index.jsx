import { useState, useEffect } from 'react';
import { Button, App, Tooltip, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import OmlatModal from './OmlatModal';
import { fetchOmlat, addOmlat, updateOmlat, deleteOmlat } from '@/api/Omlat';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const OmlatPage = () => {
  const [omlat, setOmlat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOmla, setSelectedOmla] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  const loadOmlat = async () => {
    setLoading(true);
    try {
      const data = await fetchOmlat();
      setOmlat(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOmlat();
  }, []);

  const handleAdd = () => {
    setSelectedOmla(null);
    setModalVisible(true);
  };

  const handleEdit = (omla) => {
    loadOmlat().then(() => {
      setSelectedOmla(omla);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteOmlat(id);
      notify.success(t('deleteSuccess'));
      loadOmlat();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedOmla) {
        await updateOmlat(selectedOmla.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addOmlat(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadOmlat();
    } catch (error) {
      notify.error(selectedOmla ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('currencyCode'),
      
      sortable: true,
      render: (value) => <span className="font-mono font-bold">{value}</span>,
    },
    {
      key: 'nameAr',
      label: t('currencyNameAr'),
      
      sortable: true,
    },
    {
      key: 'nameEn',
      label: t('currencyNameEn'),
      
      sortable: true,
    },
    {
      key: 'symbol',
      label: t('currencySymbol'),
      
      sortable: true,
      render: (value) => <span className="text-lg">{value}</span>,
    },
    {
      key: 'exchangeRate',
      label: t('exchangeRate'),
      width: '12%',
      sortable: true,
      render: (value) => <span className="font-mono">{value}</span>,
    },
    {
      key: 'fractionNameAr',
      label: t('fractionNameAr'),
      
      render: (value) => value || '—',
    },
    {
      key: 'fractionNameEn',
      label: t('fractionNameEn'),
     
      render: (value) => value || '—',
    },
    {
      key: 'isDefault',
      label: t('defaultCurrency'),
      
      render: (value) => (
        <Tag color={value ? 'gold' : 'default'}>
          {value ? t('yes') : t('no')}
        </Tag>
      ),
    },
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      
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
              }
              if (key === 'delete') {
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
            <span className="text-lg font-semibold">{t('currencies')}</span>
            <span className="text-sm text-gray-400">
              {t('total')}: {omlat.length}
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={omlat}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('currenciesReport')}
          printFileName="omlat-report"
          filters={false}
          showReload
          onReload={loadOmlat}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 1000 }}
        />
      </Card>

      <OmlatModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedOmla}
        loading={saving}
      />
    </div>
  );
};

export default OmlatPage;