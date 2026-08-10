import { useState, useEffect } from 'react';
import { Button, App, Tooltip, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReportGenerator from "@/utils/ReportGenerator";
import GroupModal from './categorieModal';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/api/categorie';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslate();

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setGroups(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleAdd = () => {
    setSelectedGroup(null);
    setModalVisible(true);
  };

  const handleEdit = (group) => {
    loadGroups().then(() => {
      setSelectedGroup(group);
      setModalVisible(true);
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      notify.success(t('deleteSuccess'));
      loadGroups();
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (selectedGroup) {
        await updateCategory(selectedGroup.id, values);
        notify.success(t('updateSuccess'));
      } else {
        await addCategory(values);
        notify.success(t('saveSuccess'));
      }
      setModalVisible(false);
      loadGroups();
    } catch (error) {
      notify.error(selectedGroup ? t('updateError') : t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('code'),
      width: '15%',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'name',
      label: t('groupName'),
      width: '55%',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'isActive',
      label: t('status'),
      width: '15%',
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
      width: '15%',
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
            <span className="text-lg font-semibold">{t('groups')}</span>
            <span className="text-sm text-gray-400">
              
            </span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={groups}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('groupsReport')}
          printFileName="groups-report"
          filters={false}
          showReload
          onReload={loadGroups}
          bordered
          size="middle"
          fixedColumns={false}
          enableStickyHeader={true}
          scroll={{ x: 'max-content', y: 55 * 5 }}
        />
      </Card>

      <GroupModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        initialValues={selectedGroup}
        loading={saving}
      />
    </div>
  );
};

export default GroupsPage;