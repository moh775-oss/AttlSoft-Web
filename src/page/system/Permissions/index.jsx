// src/page/system/Permissions/index.jsx
import { useState, useEffect } from 'react';
import { Card, Tree, Switch, Button, Row, Col, Tag, Space, Spin, Empty, Input, Checkbox } from 'antd';
import { SaveOutlined, ReloadOutlined, UserOutlined, SafetyOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchFormsTree } from '@/api/Forms';
import { fetchUserPermissions, saveUserPermissions } from '@/api/Permissions';
import { fetchUsers } from '@/api/User';
import { useTranslate } from '@/hooks/useTranslate';
import notify from '@/utils/notify';
import './Permissions.css';

const PermissionsPage = () => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [searchText, setSearchText] = useState('');

  const permissionMap = [
    { key: 'IS_New_Visible', label: 'إضافة', color: 'green' },
    { key: 'IS_Save_Visible', label: 'حفظ', color: 'blue' },
    { key: 'IS_Update_Visible', label: 'تعديل', color: 'orange' },
    { key: 'IS_Delete_Visible', label: 'حذف', color: 'red' },
    { key: 'IS_Search_Visible', label: 'بحث', color: 'cyan' },
    { key: 'IS_Print_Visible', label: 'طباعة', color: 'purple' },
    { key: 'IS_Preview_Visible', label: 'معاينة', color: 'magenta' },
  ];

  useEffect(() => {
    loadUsers();
    loadForms();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadForms = async () => {
    setLoading(true);
    try {
      const forms = await fetchFormsTree();
      const tree = buildTree(forms);
      setTreeData(tree);
      setExpandedKeys(getAllKeys(tree));
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (forms) => {
    const map = {};
    const roots = [];

    forms.forEach(form => {
      map[form.id] = {
        title: form.name,
        key: `form_${form.id}`,
        formId: form.id,
        formName: form.name,
        parentId: form.Parent_id,
        isParent: form.IS_Parent === 1,
        order: form.Form_Seq_Order || 0,
        permissions: {
          IS_New_Visible: form.IS_New_Visible === 1,
          IS_Save_Visible: form.IS_Save_Visible === 1,
          IS_Update_Visible: form.IS_Update_Visible === 1,
          IS_Delete_Visible: form.IS_Delete_Visible === 1,
          IS_Search_Visible: form.IS_Search_Visible === 1,
          IS_Print_Visible: form.IS_Print_Visible === 1,
          IS_Preview_Visible: form.IS_Preview_Visible === 1,
        },
        children: [],
      };
    });

    forms.forEach(form => {
      if (form.Parent_id && map[form.Parent_id]) {
        map[form.Parent_id].children.push(map[form.id]);
      } else if (form.IS_Parent === 1) {
        roots.push(map[form.id]);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.order - b.order);
      nodes.forEach(node => {
        if (node.children?.length) sortTree(node.children);
      });
    };
    sortTree(roots);

    return roots;
  };

  const getAllKeys = (tree) => {
    const keys = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
        keys.push(node.key);
        if (node.children?.length) traverse(node.children);
      });
    };
    traverse(tree);
    return keys;
  };

  const handleUserSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter(u =>
      (u.fullName || '').toLowerCase().includes(value.toLowerCase()) ||
      (u.userName || '').toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    setLoading(true);
    try {
      const result = await fetchUserPermissions(userId);
      if (result.success && result.data) {
        setPermissions(result.data);
        const checked = [];
        Object.keys(result.data).forEach(formId => {
          if (Object.values(result.data[formId] || {}).some(v => v === true)) {
            checked.push(`form_${formId}`);
          }
        });
        setCheckedKeys(checked);
      } else {
        setPermissions({});
        setCheckedKeys([]);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (formId, permissionKey, value) => {
    setPermissions(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [permissionKey]: value,
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) {
      notify.warning(t('pleaseSelectUser'));
      return;
    }
    setSaving(true);
    try {
      const result = await saveUserPermissions(selectedUser, permissions);
      if (result.success) {
        notify.success(t('permissionsSaved'));
      } else {
        notify.error(result.message || t('errorSavingPermissions'));
      }
    } catch (error) {
      notify.error(t('errorSavingPermissions'));
    } finally {
      setSaving(false);
    }
  };

  const renderTreeTitle = (node) => {
    if (!node.isParent && node.formId) {
      return (
        <div className="permission-node">
          <span className="permission-name">{node.title}</span>
          <div className="permission-switches">
            {permissionMap.map(perm => (
              <div key={perm.key} className="permission-switch-item">
                <Tag color={perm.color} className="permission-tag">{perm.label}</Tag>
                <Switch
                  size="small"
                  checked={permissions[node.formId]?.[perm.key] || false}
                  onChange={(checked) => handlePermissionChange(node.formId, perm.key, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <span className="permission-parent-name">{node.title}</span>;
  };

  return (
    <div className="permissions-page">
      <Row gutter={16} className="permissions-container">
        <Col xs={24} md={6}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>{t('users')}</span>
              </Space>
            }
            className="permissions-card"
            bodyStyle={{ padding: 0 }}
          >
            <div className="users-search">
              <Input
                placeholder={t('search')}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleUserSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="users-list">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  className={`user-item ${selectedUser === u.id ? 'user-item-active' : ''}`}
                  onClick={() => handleUserSelect(u.id)}
                >
                  <div className="user-avatar">
                    {u.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{u.fullName || u.userName}</span>
                    <span className="user-type">{u.userType}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <Card
            title={
              <div className="permissions-header">
                <Space>
                  <SafetyOutlined />
                  <span>{t('permissions')}</span>
                  {selectedUser && (
                    <Tag color="blue">
                      {users.find(u => u.id === selectedUser)?.fullName}
                    </Tag>
                  )}
                </Space>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => handleUserSelect(selectedUser)} disabled={!selectedUser}>
                    {t('refresh')}
                  </Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} disabled={!selectedUser}>
                    {t('save')}
                  </Button>
                </Space>
              </div>
            }
            className="permissions-card"
          >
            {loading ? (
              <div className="permissions-loading"><Spin size="large" /></div>
            ) : !selectedUser ? (
              <Empty description={t('permissionsList')} />
            ) : (
              <Tree
                checkable
                showLine
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={(keys) => { setExpandedKeys(keys); setAutoExpandParent(false); }}
                onCheck={setCheckedKeys}
                checkedKeys={checkedKeys}
                treeData={treeData}
                titleRender={renderTreeTitle}
                className="permissions-tree"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PermissionsPage;