import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

// Define the Prestamo type
type Prestamo = {
  id_prestamo: number;
  tasa_interes: number;
  fecha_inicio: string;
  fecha_final: string;
  monto_original: number;
  saldo: number;
  estado: string | null;
  id_cliente: number;
  id_asesor: number;
};

const PrestamoTable = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Prestamo`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Prestamo[] = await response.json();
        setPrestamos(data);
      } catch (error) {
        console.error('Error fetching prestamos:', error);
        setError('Failed to fetch loan data. Please try again later.');
      }
    };

    fetchPrestamos();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h5>Préstamos registrados</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Saldo</th>
            <th>Interés</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id_prestamo}>
              <td>{prestamo.id_prestamo}</td>
              <td>₡{prestamo.monto_original.toLocaleString()}</td>
              <td>₡{prestamo.saldo.toLocaleString()}</td>
              <td>{prestamo.tasa_interes}%</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Pago Normal</button>
                <button className="btn btn-sm btn-outline-warning me-2">Pago Extraordinario</button>
                <button className="btn btn-sm btn-outline-info">Recalcular</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrestamoTable;
