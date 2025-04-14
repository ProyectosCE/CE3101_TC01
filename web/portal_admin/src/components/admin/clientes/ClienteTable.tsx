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
 * Component: ClienteTable
 * Tabla para mostrar la lista de clientes registrados y sus datos principales.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <ClienteTable />
 */

const ClienteTable = () => {
    return (
      <div>
        <h5>Clientes registrados</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>123456789</td>
              <td>8888-8888</td>
              <td>Físico</td>
              <td>juan123</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ClienteTable;
