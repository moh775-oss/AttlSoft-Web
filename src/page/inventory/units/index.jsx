import { useState, useEffect } from 'react';
import { Button, Tooltip, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import UnitModal from './UnitModal';
import { fetchUnits, addUnit, updateUnit, deleteUnit } from '@/api/unit';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const UnitsPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();

  const loadUnits = async () => {
    setLoading(true);
    try {
      const data = await fetchUnits();
      setUnits(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleAdd = () => {
    setSelectedUnit(null);
    setModalVisible(true);
  };

  const handleEdit = (unit) => {
    loadUnits().then(() => {
      setSelectedUnit(unit);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteUnit(id);
      notify.success(t('deleteSuccess'));
      loadUnits();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedUnit) {
        await updateUnit(selectedUnit.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addUnit(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadUnits();
    } catch (error) {
      notify.error(selectedUnit ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('code'),
      width: '25%',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'name',
      label: t('unitName'),
      width: '55%',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      width: '20%',
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
            <span className="text-lg font-semibold">{t('units')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={units}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('unitsReport')}
          printFileName="units-report"
          filters={false}
          showReload
          onReload={loadUnits}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      <UnitModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedUnit}
        loading={saving}
      />
    </div>
  );
};

export default UnitsPage;