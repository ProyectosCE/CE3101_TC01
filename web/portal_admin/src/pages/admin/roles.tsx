import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import RoleForm from '@/components/admin/roles/RoleForm';
import RoleTable from '@/components/admin/roles/RoleTable';
import { API_ENDPOINT } from '@/config/api';

export interface Role {
  id_rol: string; // Updated to match the API response
  descripcion: string; // Updated to match the API response
}

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}RolCrontroller`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Role[] = await response.json();
        setRoles(data); // Directly set the API response as it matches the updated Role interface
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to fetch roles. Please try again later.');
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = (role: Role) => {
    setRoles([...roles, role]); // Directly add the full Role object
  };

  const handleDeleteRole = (id_rol: string) => {
    setRoles(roles.filter((r) => r.id_rol !== id_rol));
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map((r) => (r.id_rol === updatedRole.id_rol ? updatedRole : r)));
    setEditingRole(null);
  };

  return (
    <AdminLayout>
      <h2>Gestión de Roles</h2>
      {error && <p className="text-danger">{error}</p>}
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
