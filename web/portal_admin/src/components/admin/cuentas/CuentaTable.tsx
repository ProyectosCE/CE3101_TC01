 */
 * <CuentaTable />
 * Example:
 *
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Tabla para mostrar la lista de cuentas bancarias registradas y sus datos principales.
 * Component: CuentaTable
/**
 * Props:
/*
================================== LICENCIA ==============
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
====================================
Jimmy Feng Feng,
Alexander Montero Vargas
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
Adrian Muñoz Alvarado,
=======================================================
*/


import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';
import type { Cuenta } from '@/components/admin/cuentas/CuentaForm'; // Import Cuenta type

const CuentaTable = ({ onEditCuenta }: { onEditCuenta: (cuenta: Cuenta) => void }) => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Cuenta?tipo=all`);
        if (response.ok) {
          const data: Cuenta[] = await response.json();
          setCuentas(data);
        } else {
          console.error('Error fetching cuentas');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCuentas();
  }, []);

  const handleDeleteCuenta = async (cuenta: Cuenta) => {
    try {
      const response = await fetch(`${API_ENDPOINT}Cuenta/agregarCuenta?tipo=borrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuenta),
      });
      if (response.ok) {
        window.location.reload(); // Reload the page on success
      } else {
        console.error('Error deleting cuenta:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h5>Cuentas registradas</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Número</th>
            <th>Descripción</th>
            <th>Moneda</th>
            <th>Tipo</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta) => (
            <tr key={cuenta.numero_cuenta}>
              <td>{cuenta.numero_cuenta}</td>
              <td>{cuenta.descripcion}</td>
              <td>{cuenta.id_moneda}</td>
              <td>{cuenta.id_tipo_cuenta}</td>
              <td>{cuenta.cedula}</td>
              <td>
                <button className="btn btn-sm btn-outline-success me-2">Depósito</button>
                <button className="btn btn-sm btn-outline-warning me-2">Retiro</button>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEditCuenta(cuenta)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteCuenta(cuenta)}
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

export default CuentaTable;
