import { Role } from '@/pages/admin/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

interface RoleTableProps {
  roles: Role[];
  onDeleteRole: (id_rol: string, descripcion: string) => void; // Updated to include descripcion
  onEditRole: (role: Role) => void;
}

const RoleTable = ({ roles, onDeleteRole, onEditRole }: RoleTableProps) => {
  if (roles.length === 0) {
    return <p>No hay roles registrados.</p>;
  }

  return (
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>ID Rol</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id_rol}>
            <td>{role.id_rol}</td>
            <td>{role.descripcion}</td>
            <td>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onEditRole(role)}
              >
                <FontAwesomeIcon icon={faEdit} /> Editar
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDeleteRole(role.id_rol, role.descripcion)} // Pass both id_rol and descripcion
              >
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoleTable;
