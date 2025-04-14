/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: RoleTable
 * Tabla para mostrar la lista de roles registrados y sus descripciones.
 *
 * Props:
 * - roles: Lista de roles a mostrar.
 * - onDeleteRole: Función para eliminar un rol por id.
 * - onEditRole: Función para editar un rol.
 *
 * Example:
 * <RoleTable roles={roles} onDeleteRole={fn} onEditRole={fn} />
 */

import { Role } from '@/pages/admin/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

interface RoleTableProps {
  roles: Role[];
  onDeleteRole: (id: number) => void;
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
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td>{role.description}</td>
            <td>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onEditRole(role)}
              >
                <FontAwesomeIcon icon={faEdit} /> Editar
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDeleteRole(role.id)}
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
