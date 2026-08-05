import { useState, useEffect } from 'react';
import { Button, App, Tooltip, Card, Dropdown, Modal, Tag, Switch } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import StoreModal from './StoreModal';
import { fetchStore, addStore, updateStore, deleteStore } from '@/api/Store';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const StorePage = () => {
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();


  const loadStore = async () => {
    setLoading(true);
    try {
      const data = await fetchStore();
      setStore(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const handleAdd = () => {
    setSelectedStore(null);
    setModalVisible(true);
  };

  const handleEdit = (storeItem) => {
    loadStore().then(() => {
      setSelectedStore(storeItem);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStore(id);
      notify.success(t('deleteSuccess'));
      loadStore();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedStore) {
        await updateStore(selectedStore.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addStore(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadStore();
    } catch (error) {
      notify.error(selectedStore ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('code'),
      
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'name',
      label: t('storeName'),
      
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'manager',
      label: t('manager'),
      
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'phone',
      label: t('phone'),
      
      render: (value) => value || '—',
    },
    {
      key: 'address',
      label: t('address'),
      
      render: (value) => value || '—',
    },
    {
      key: 'branch',
      label: t('branch'),
      
      render: (value) => value || '—',
    },
    {
      key: 'allBranches',
      label: t('allBranches'),
      
      render: (value) => (
        <Tag color={value ? 'green' : 'gray'}>
          {value ? t('yes') : t('no')}
        </Tag>
      ),
    },
    {
      key: 'isActive',
      label: t('status'),
      
      render: (value) => (
        <Tag color={value !== false ? 'green' : 'red'}>
          {value !== false ? t('active') : t('inactive')}
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
            <span className="text-lg font-semibold">{t('store')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={store}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('storeReport')}
          printFileName="store-report"
          filters={false}
          showReload
          onReload={loadStore}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 1000 }}
        />
      </Card>

      <StoreModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedStore}
        loading={saving}
      />
    </div>
  );
};

export default StorePage;