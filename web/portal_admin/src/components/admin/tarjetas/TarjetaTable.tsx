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
 * Component: TarjetaTable
 * Tabla para mostrar la lista de tarjetas registradas y sus datos principales.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <TarjetaTable />
 */

import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

interface Tarjeta {
  numero_tarjeta: number;
  cvc: number;
  fecha_vencimiento: string;
  monto_disponible: number | null;
  monto_credito: number | null;
  id_cliente: number;
  tipo: string;
  marca: string;
  numero_cuenta: number;
  cedula: string;
}

const TarjetaTable = () => {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Tarjeta`);
        if (response.ok) {
          const data: Tarjeta[] = await response.json();
          setTarjetas(data);
        } else {
          console.error('Error fetching tarjetas');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTarjetas();
  }, []);

  return (
    <div>
      <h5>Tarjetas registradas</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Número</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Cuenta Asociada</th>
            <th>Cliente</th>
            <th>Expira</th>
            <th>Saldo/Crédito</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map((tarjeta) => (
            <tr key={tarjeta.numero_tarjeta}>
              <td>{tarjeta.numero_tarjeta}</td>
              <td>{tarjeta.tipo}</td>
              <td>{tarjeta.marca}</td>
              <td>
                {tarjeta.tipo === 'DEBITO'
                  ? `${tarjeta.numero_cuenta}`
                  : `N/A`}
    
              </td>
              <td>{tarjeta.cedula}</td>
              <td>{tarjeta.fecha_vencimiento}</td>
              <td>
                {tarjeta.tipo === 'DEBITO'
                  ? `₡${tarjeta.monto_disponible?.toLocaleString() || '0.00'}`
                  : `₡${tarjeta.monto_credito?.toLocaleString() || '0.00'}`}
              </td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                <button className="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TarjetaTable;
