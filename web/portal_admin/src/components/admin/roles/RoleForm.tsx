import { useEffect, useState } from 'react';
import { Role } from '@/pages/admin/roles';
import { API_ENDPOINT } from '@/config/api';

interface RoleFormProps {
  onAddRole: (role: Role) => void; // Updated to accept a full Role object
  onUpdateRole: (role: Role) => void;
  editingRole: Role | null;
}

const RoleForm = ({ onAddRole, onUpdateRole, editingRole }: RoleFormProps) => {
  const [idRol, setIdRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingRole) {
      setIdRol(editingRole.id_rol);
      setDescripcion(editingRole.descripcion);
    } else {
      setIdRol('');
      setDescripcion('');
    }
  }, [editingRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tipo = editingRole ? 'editar' : 'nuevo';
    const apiUrl = `${API_ENDPOINT}RolCrontroller?tipo=${tipo}`;
    const roleData = { id_rol: idRol, descripcion };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });

      if (response.ok) {
        setPopupMessage(editingRole ? 'Rol actualizado exitosamente.' : 'Rol añadido exitosamente.');
        window.location.reload(); // Reload the page on success
      } else {
        setPopupMessage('Error al procesar la solicitud. Inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setPopupMessage('Error al conectar con el servidor.');
    }

    setIdRol('');
    setDescripcion('');
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
    window.location.reload();
  };

  return (
    <>
      {popupMessage && (
        <div className="alert alert-info" role="alert">
          {popupMessage}
          <button type="button" className="btn-close" onClick={handlePopupClose}></button>
        </div>
      )}
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
    </>
  );
};

export default RoleForm;
