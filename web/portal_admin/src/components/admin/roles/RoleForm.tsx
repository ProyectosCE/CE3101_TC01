import { useEffect, useState } from 'react';
import { Role } from '@/pages/admin/roles';

interface RoleFormProps {
  onAddRole: (role: Role) => void; // Updated to accept a full Role object
  onUpdateRole: (role: Role) => void;
  editingRole: Role | null;
}

const RoleForm = ({ onAddRole, onUpdateRole, editingRole }: RoleFormProps) => {
  const [idRol, setIdRol] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (editingRole) {
      setIdRol(editingRole.id_rol);
      setDescripcion(editingRole.descripcion);
    } else {
      setIdRol('');
      setDescripcion('');
    }
  }, [editingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      onUpdateRole({ ...editingRole, id_rol: idRol, descripcion });
    } else {
      onAddRole({ id_rol: idRol, descripcion }); // Pass a full Role object
    }
    setIdRol('');
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">ID del Rol</label>
        <input
          type="text"
          className="form-control"
          value={idRol}
          onChange={(e) => setIdRol(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
