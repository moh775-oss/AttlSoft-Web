
import { useState, useEffect } from 'react';
import { Button, Space, Popconfirm,  Tooltip, Card, App ,Dropdown , Modal } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined 
} from '@ant-design/icons';
import ReportGenerator from '@/utils/ReportGenerator';
import SupplierModal from './SupplierModal';
import notify from "@/utils/notify.jsx";
import { 
  fetchSuppliers, 
  addSupplier, 
  updateSupplier, 
  deleteSupplier,
  
} from '@/api/supplier';
import { useTranslate } from '@/hooks/useTranslate';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  // جلب الموردين
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      notify.error(t('error.general.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // إضافة
  const handleAdd = () => {
    setSelectedSupplier(null);
    setModalVisible(true);
  };

  // تعديل
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setModalVisible(true);
  };

  // حذف
  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      notify.success(t('deleteSuccess'));
      loadSuppliers();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  // حفظ
  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedSupplier) {
        // تعديل
        await updateSupplier(selectedSupplier.id, values);
        notify.success(t('updateSuccess'));
      } else {
        // إضافة
        await addSupplier(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadSuppliers();
    } catch (error) {
      notify.error(
        selectedSupplier 
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
      label: ` ${t('code')}`,
      width: 120,
      sortable: true,
      render: (value) => <span className="font-mono text-xs">{value}</span>,
    },
    {
      key: 'name',
      label: t('supplierName'),
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          
        </div>
      ),
    },
    {
      key: 'phone',
      label: t('phone'),
      sortable: true,
      width: 150,
      render: (value) => value || '—',
    },
    {
      key: 'accNo',
      label: t('account'),
      sortable: true,
      width: 130,
      render: (value) => (
        <span className="font-mono text-sm">{value || '—'}</span>
      ),
    },
    {
      key: 'vatNo',
      label: t('vatNumber'),
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'bussnsNo',
      label: t('businessNumber'),
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'balance',
      label: t('balance'),
      width: 130,
      sortable: true,
      render: (value) => (
        <span className={value < 0 ? 'text-red-500' : 'text-green-600'}>
          {value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'debitLimit',
      label: t('supplierCreditLimit'),
      width: 130,
      sortable: true,
      render: (value) => value?.toLocaleString() || 0,
    },
    {
      key: 'country',
      label: t('country'),
      render: (value) => value || '—',
    },
    {
      key: 'city',
      label: t('city'),
      render: (value) => value || '—',
    },
    {
      key: 'street',
      label: t('street'),
      render: (value) => value || '—',
    },
    
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      width: 90,
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
            <span className="text-lg font-semibold">{t('suppliers')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={suppliers}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('suppliersReport')}
          printFileName="suppliers-report"
          filters={false}
          showReload
          onReload={loadSuppliers}
          bordered
          size="middle"
          scroll={{ x: 1100 }}
        />
      </Card>

      <SupplierModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedSupplier}
        loading={saving}
      />
    </div>
  );
};

export default SuppliersPage;