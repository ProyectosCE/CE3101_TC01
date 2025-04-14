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
 * Component: AsesorTable
 * Tabla para mostrar la lista de asesores registrados y sus métricas principales.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <AsesorTable />
 */

const AsesorTable = () => {
    return (
      <div>
        <h5>Asesores registrados</h5>
        <button className="btn btn-outline-info mb-3">Generar Reporte Mensual</button>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Meta ₡</th>
              <th>Meta $</th>
              <th>Créditos ₡</th>
              <th>Créditos $</th>
              <th>Comisión ₡</th>
              <th>Comisión $</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos Rodríguez</td>
              <td>123456789</td>
              <td>₡1,000,000</td>
              <td>$2,000</td>
              <td>₡1,200,000</td>
              <td>$2,300</td>
              <td>₡36,000</td>
              <td>$69</td>
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
  
  export default AsesorTable;
