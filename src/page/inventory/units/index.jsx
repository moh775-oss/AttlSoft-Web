// src/pages/Units/index.jsx

import { useState, useEffect } from 'react';

import { Button, Space, Popconfirm, message, Tag, Tooltip, Card , Dropdown , Modal } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import UnitModal from './unitModal.jsx';
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
      notify.error(t('error.general.operationFailed'));
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
    setSelectedUnit(unit);
    setModalVisible(true);
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
        // تعديل
        await updateUnit(selectedUnit.id, values);
        notify.success(t('updateSuccess'));
      } else {
        // إضافة
        await addUnit(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadUnits();
    } catch (error) {
      notify.error(
        selectedUnit 
          ? t('updateError') 
          : t('saveError')
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('unitCode'),
     
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'name',
      label: t('unitName'),
      sortable: true,

      render: (value, record) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          
        </div>
      ),
    },
    
    {
      key: 'isActive',
      label: t('status'),
  
      render: (value) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? t('active') : t('inactive')}
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
    <Button type="text" icon={<MoreOutlined />} />
  </Dropdown>
),
    },
  ];

  return (
    <div className="p-4">
      <Card 
        title={
          <div className="flex items-center justify-between w-full">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {t('add')}
            </Button>
            <span className="text-lg font-semibold">{t('units')}</span>
            <span className="text-sm text-gray-400">
              {t('total')}: {units.length}
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