import { useState, useEffect } from 'react';
import { Button, Space, App, Tooltip, Card, Dropdown, Modal } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import BankModal from './BankModal';
import { fetchBanks, addBank, updateBank, deleteBank } from '@/api/Bank';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  const loadBanks = async () => {
    setLoading(true);
    try {
      const data = await fetchBanks();
      setBanks(data);
    } catch (error) {
      notify.error(t('error.general.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleAdd = () => {
    setSelectedBank(null);
    setModalVisible(true);
  };

  const handleEdit = (bank) => {
    // جلب أحدث البيانات قبل التعديل
    loadBanks().then(() => {
      setSelectedBank(bank);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBank(id);
      notify.success(t('deleteSuccess'));
      loadBanks();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedBank) {
        await updateBank(selectedBank.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addBank(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadBanks();
    } catch (error) {
      notify.error(selectedBank ? t('updateError') : t('saveError'));
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
      key: 'bankName',
      label: t('bankName'),
      
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'branchName',
      label: t('branchName'),
      
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'accNo',
      label: t('accountNumber'),
     
      sortable: true,
      render: (value) => <span className="font-mono">{value || '—'}</span>,
    },
    {
      key: 'accType',
      label: t('accountType'),
     
      sortable: true,
      render: (value) => value || '—',
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
            <span className="text-lg font-semibold">{t('banks')}</span>
            <span className="text-sm text-gray-400">
                
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={banks}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('banksReport')}
          printFileName="banks-report"
          filters={false}
          showReload
          onReload={loadBanks}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 1000 }}
        />
      </Card>

      <BankModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedBank}
        loading={saving}
      />
    </div>
  );
};

export default BanksPage;