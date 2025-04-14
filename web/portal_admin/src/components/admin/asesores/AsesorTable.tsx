/*
================================== LICENCIA ==============
====================================
MIT License
Jimmy Feng Feng,
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: AsesorTable
 * Tabla para mostrar la lista de asesores registrados y sus métricas principales.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <AsesorTable />
 */
interface Asesor {
  id_asesor?: number; // Changed to optional
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  monto_meta: number;
  id_rol: string;
}

interface AsesorTableProps {
  asesores: Asesor[];
  onDeleteAsesor: (asesor: Asesor) => void;
  onEditAsesor: (asesor: Asesor) => void;
}

const AsesorTable = ({ asesores, onDeleteAsesor, onEditAsesor }: AsesorTableProps) => {
  return (
    <div>
      <h5>Asesores registrados</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Fecha de Nacimiento</th>
            <th>Meta ₡</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asesores.map((asesor) => (
            <tr key={asesor.id_asesor}>
              <td>{asesor.nombre}</td>
              <td>{asesor.cedula}</td>
              <td>{asesor.fecha_nacimiento}</td>
              <td>₡{asesor.monto_meta.toLocaleString()}</td>
              <td>{asesor.id_rol}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEditAsesor(asesor)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteAsesor(asesor)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsesorTable;
