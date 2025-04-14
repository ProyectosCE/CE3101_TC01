import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import RoleForm from '@/components/admin/roles/RoleForm';
import RoleTable from '@/components/admin/roles/RoleTable';

export interface Role {
  id: number;
  name: string;
  description: string;
}

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleAddRole = (role: Omit<Role, 'id'>) => {
    const newRole: Role = {
      id: Date.now(),
      ...role,
    };
    setRoles([...roles, newRole]);
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    setEditingRole(null);
  };

  return (
    <AdminLayout>
      <h2>Gestión de Roles</h2>
      <RoleForm
        onAddRole={handleAddRole}
        onUpdateRole={handleUpdateRole}
        editingRole={editingRole}
      />
      <RoleTable
        roles={roles}
        onDeleteRole={handleDeleteRole}
        onEditRole={handleEditRole}
      />
    </AdminLayout>
  );
};

export default RolesPage;
