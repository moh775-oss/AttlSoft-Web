import { useState, useEffect } from 'react';
import { Button, Space, message, App, Tooltip, Card, Dropdown, Modal,   Tag, Switch } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import SafeModal from './SafeModal';
import { fetchSafes, addSafe, updateSafe, deleteSafe } from '@/api/Safe';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const SafesPage = () => {
  const [safes, setSafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSafe, setSelectedSafe] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  const loadSafes = async () => {
    setLoading(true);
    try {
      const data = await fetchSafes();
      
      setSafes(data);
    } catch (error) {
      notify.error(t('error.general.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSafes();
  }, []);

  const handleAdd = () => {
    setSelectedSafe(null);
    setModalVisible(true);
  };

  const handleEdit = (safe) => {
    // جلب أحدث البيانات قبل التعديل
    loadSafes().then(() => {
      setSelectedSafe(safe);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSafe(id);
      notify.success(t('deleteSuccess'));
      loadSafes();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedSafe) {
        await updateSafe(selectedSafe.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addSafe(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadSafes();
    } catch (error) {
      notify.error(selectedSafe ? t('updateError') : t('saveError'));
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
      label: t('safeName'),
      
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'accNo',
      label: t('accountNumber'),
      
      sortable: true,
      render: (value) => <span className="font-mono">{value || '—'}</span>,
    },
    {
      key: 'branch',
      label: t('branch'),
      
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'allBranches',
      label: t('allBranches'),
      
      sortable: true,
      render: (value) => (
        <Tag color={value ? 'green' : 'gray'}>
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
            <span className="text-lg font-semibold">{t('safes')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={safes}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('safesReport')}
          printFileName="safes-report"
          filters={false}
          showReload
          onReload={loadSafes}
          bordered
          className="mt-4"
          fixedColumns={false}
          enableStickyHeader={true}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <SafeModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedSafe}
        loading={saving}
      />
    </div>
  );
};

export default SafesPage;