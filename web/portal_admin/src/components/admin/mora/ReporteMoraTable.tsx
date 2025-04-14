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
 * Component: ReporteMoraTable
 * Tabla para mostrar el reporte de clientes en mora, incluyendo cuotas vencidas y monto adeudado.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <ReporteMoraTable />
 */

import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

// Define the Mora type
type Mora = {
  id_mora: number;
  cuotas_vencidas: number;
  monto_adeudado: number;
  cedula: string;
  nombre_completo: string;
  id_prestamo: number;
};

const ReporteMoraTable = () => {
  const [moras, setMoras] = useState<Mora[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoras = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Mora`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Mora[] = await response.json();
        setMoras(data);
      } catch (error) {
        console.error('Error fetching mora data:', error);
        setError('Failed to fetch mora data. Please try again later.');
      }
    };

    fetchMoras();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <button className="btn btn-outline-info mb-3">Generar Reporte</button>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Cliente</th>
            <th>Cédula</th>
            <th>Préstamo</th>
            <th>Cuotas vencidas</th>
            <th>Monto adeudado</th>
          </tr>
        </thead>
        <tbody>
          {moras.map((mora) => (
            <tr key={mora.id_mora}>
              <td>{mora.nombre_completo}</td>
              <td>{mora.cedula}</td>
              <td>#{mora.id_prestamo}</td>
              <td>{mora.cuotas_vencidas}</td>
              <td>₡{mora.monto_adeudado.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteMoraTable;
