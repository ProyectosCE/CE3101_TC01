import { useEffect, useState } from 'react';
import { Role } from '@/pages/admin/roles';

interface RoleFormProps {
  onAddRole: (role: Omit<Role, 'id'>) => void;
  onUpdateRole: (role: Role) => void;
  editingRole: Role | null;
}

const RoleForm = ({ onAddRole, onUpdateRole, editingRole }: RoleFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name);
      setDescription(editingRole.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [editingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      onUpdateRole({ ...editingRole, name, description });
    } else {
      onAddRole({ name, description });
    }
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Nombre del Rol</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {editingRole ? 'Actualizar Rol' : 'Agregar Rol'}
      </button>
    </form>
  );
};

export default RoleForm;
