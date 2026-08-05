import { useState, useEffect } from 'react';
import { Button, App, Tooltip, Card, Dropdown, Modal, Tag, Switch } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import TaxModal from './TaxModal';
import { fetchTaxes, addTax, updateTax, deleteTax } from '@/api/Tax';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();
  const { message } = App.useApp();

  const loadTaxes = async () => {
    setLoading(true);
    try {
      const data = await fetchTaxes();
      setTaxes(data);
    } catch (error) {
      notify.error(t('error.general.operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleAdd = () => {
    setSelectedTax(null);
    setModalVisible(true);
  };

  const handleEdit = (tax) => {
    loadTaxes().then(() => {
      setSelectedTax(tax);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTax(id);
      notify.success(t('deleteSuccess'));
      loadTaxes();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedTax) {
        await updateTax(selectedTax.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addTax(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadTaxes();
    } catch (error) {
      notify.error(selectedTax ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: t('code'),
      
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'nameAr',
      label: t('taxName'),
      
      sortable: true,
      render: (value, record) => (
        <div>
          <span className="font-medium">{value}</span>
          {record.nameEn && (
            <span className="text-xs text-gray-400 block">({record.nameEn})</span>
          )}
        </div>
      ),
    },
    {
      key: 'taxPercent',
      label: t('taxRate'),
      
      sortable: true,
      render: (value) => (
        <span className="font-mono font-medium text-blue-600">
          {value}%
        </span>
      ),
    },
    {
      key: 'isDefault',
      label: t('taxDefault'),
      
      render: (value) => (
        <Tag color={value ? 'gold' : 'default'}>
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
      width: '10%',
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
            <span className="text-lg font-semibold">{t('taxes')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={taxes}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('taxesReport')}
          printFileName="taxes-report"
          filters={false}
          showReload
          onReload={loadTaxes}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 'max-content', y: 55 * 5 }}
        />
      </Card>

      <TaxModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedTax}
        loading={saving}
      />
    </div>
  );
};

export default TaxesPage;