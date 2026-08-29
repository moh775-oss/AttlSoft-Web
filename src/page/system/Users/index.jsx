import { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Modal, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReportGenerator from "@/utils/ReportGenerator";
import { fetchUsers, deleteUser } from '@/api/User';
import { useTranslate } from '@/hooks/useTranslate';
import notify from "@/utils/notify.jsx";

const UsersPage = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      notify.error(t('operationFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = () => {
    navigate('/system/users/add');
  };

  const handleEdit = (user) => {
    navigate(`/system/users/edit/${user.id}`);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteUser(id);
      if (result.success) {
        notify.success(result.message || t('deleteSuccess'));
        loadUsers();
      } else {
        notify.error(result.message || t('deleteError'));
      }
    } catch (error) {
      notify.error(t('deleteError'));
    }
  };

  const columns = [
    {
      key: 'userId',
      label: t('code'),
      sortable: true,
      width:'10%',
      render: (value) => <span className="font-mono text-sm">{value || '—'}</span>,
    },
    {
      key: 'userName',
      label: t('userName'),
      sortable: true,
      width:'20%',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'fullName',
      label: t('fullName'),
      sortable: true,
      width:'20%',
      render: (value) => value || '—',
    },
    {
      key: 'userEmail',
      label: t('email'),
      sortable: true,
      width:'20%',
      render: (value) => value || '—',
    },
    {
      key: 'userType',
      label: t('userType'),
      sortable: true,
      width:'10%',
      render: (value) => (
        <Tag color={value === 'Admin' ? 'red' : 'blue'}>
          {value || t('user')}
        </Tag>
      ),
    },
    {
      key: 'roleStatus',
      label: t('roleStatus'),
      sortable: true,
      width:'10%',
      render: (value) => (
        <Tag color={value ? 'green' : 'gray'}>
          {value ? t('active') : t('inactive')}
        </Tag>
      ),
    },
    {
      key: 'actions',
      label: t('actions'),
      align: 'center',
      width:'10%',
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
            <span className="text-lg font-semibold">{t('users')}</span>
            <span className="text-sm text-gray-400"></span>
          </div>
        }
      >
        <ReportGenerator
          columns={columns}
          data={users}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('usersReport')}
          printFileName="users-report"
          filters={false}
          showReload
          onReload={loadUsers}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default UsersPage;