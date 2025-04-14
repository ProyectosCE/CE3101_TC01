import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

interface Tarjeta {
  numero_tarjeta: number;
  cvc: number;
  fecha_vencimiento: string;
  monto_disponible: number | null;
  monto_credito: number | null;
  id_cliente: number;
  id_tipo_tarjeta: string;
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
            <th>Expira</th>
            <th>Saldo/Crédito</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map((tarjeta) => (
            <tr key={tarjeta.numero_tarjeta}>
              <td>{tarjeta.numero_tarjeta}</td>
              <td>{tarjeta.id_tipo_tarjeta}</td>
              <td>{tarjeta.fecha_vencimiento}</td>
              <td>
                {tarjeta.id_tipo_tarjeta === 'DEBITO'
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
