
import { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Modal, Tag } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import ReportGenerator from '@/utils/ReportGenerator';
import PosModal from './PosModal';
import { fetchPos, addPos, updatePos, deletePos } from '@/api/Pos';
import { fetchBranches } from '@/api/Branch';
import { useAuth } from '@/context/AuthContext';
import { useTranslate } from '@/hooks/useTranslate';
import notify from '@/utils/notify';

const PosPointsPage = () => {
  const { t } = useTranslate();
  const { userId, branchId } = useAuth();
  const [posList, setPosList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPos, setSelectedPos] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadBranches = async () => {
    try {
      const data = await fetchBranches();
      setBranches(data || []);
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  const loadPos = async () => {
    setLoading(true);
    try {
      const data = await fetchPos();
      setPosList(Array.isArray(data) ? data : []);
    } catch (error) {
      notify.error(t('operationFailed'));
      setPosList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    loadPos();
  }, []);

  const handleAdd = () => {
    setSelectedPos(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedPos(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deletePos(id, branchId || 1, userId || 1);
      if (result.success) {
        notify.success(result.message || t('deleteSuccess'));
        loadPos();
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
      const payload = {
        posName: values.posName,
        storeId: values.storeId,
        branch: values.branch,
        userId: userId || 1,
      };

      let result;
      if (selectedPos?.id) {
        result = await updatePos(selectedPos.id, payload);
      } else {
        result = await addPos(payload);
      }

      if (result.success) {
        notify.success(
          result.message || (selectedPos ? t('updateSuccess') : t('saveSuccess'))
        );
        setModalVisible(false);
        loadPos();
      } else {
        notify.error(
          result.message || (selectedPos ? t('updateError') : t('saveError'))
        );
      }
    } catch (error) {
      notify.error(selectedPos ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const getBranchName = (id) => {
    return branches.find(b => b.id === id)?.name || '—';
  };

  const columns = [
    {
      key: 'code',
      label: t('code'),
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'posName',
      label: t('posName'),
      sortable: true,
      render: (value) => (
        <span className="font-medium flex items-center gap-2">
          <ShopOutlined className="text-primary" />
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'branch',
      label: t('branch'),
      sortable: true,
      render: (value) => getBranchName(value),
    },
    {
      key: 'storeId',
      label: t('store'),
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
              { key: 'edit', icon: <EditOutlined />, label: t('edit') },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: t('delete'),
                danger: true,
              },
            ],
            onClick: ({ key }) => {
              if (key === 'edit') handleEdit(record);
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
            <span className="text-lg font-semibold">{t('posPoints')}</span>
            <span className="text-sm text-gray-400"></span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={posList}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('posPointsReport')}
          printFileName="pos-points-report"
          filters={false}
          showReload
          onReload={loadPos}
          bordered
          size="middle"
          scroll={{ x: 800 }}
        />
      </Card>

      <PosModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedPos}
        loading={saving}
      />
    </div>
  );
};

export default PosPointsPage;