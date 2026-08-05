import { useState, useEffect } from 'react';
import { Button, App, Tooltip, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import BranchModal from './BranchModal';
import { fetchBranches, addBranch, updateBranch, deleteBranch } from '@/api/branch';
import { useTranslate } from '@/hooks/useTranslate';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      notify.error(t('error.general.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleAdd = () => {
    setSelectedBranch(null);
    setModalVisible(true);
  };

  const handleEdit = (branch) => {
    loadBranches().then(() => {
      setSelectedBranch(branch);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
      notify.success(t('deleteSuccess'));
      loadBranches();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedBranch) {
        await updateBranch(selectedBranch.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addBranch(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadBranches();
    } catch (error) {
      notify.error(selectedBranch ? t('updateError') : t('saveError'));
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
      label: t('branchName'),
      
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'address',
      label: t('address'),
      width: '25%',
      render: (value) => value || '—',
    },
    {
      key: 'phone',
      label: t('phone'),
     
      render: (value) => value || '—',
    },
    {
      key: 'manager',
      label: t('manager'),
   
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
            <span className="text-lg font-semibold">{t('branches')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={branches}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('branchesReport')}
          printFileName="branches-report"
          filters={false}
          showReload
          onReload={loadBranches}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 'max-content', y: 55 * 5 }}
        />
      </Card>

      <BranchModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedBranch}
        loading={saving}
      />
    </div>
  );
};

export default BranchesPage;