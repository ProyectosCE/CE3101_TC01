import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

interface Cuenta {
  numero_cuenta: number;
  descripcion: string;
  monto: number;
  id_cliente: number;
  id_tipo_cuenta: string;
  id_moneda: string;
}

const CuentaTable = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Cuenta`);
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
              <td>{cuenta.id_cliente}</td>
              <td>
                <button className="btn btn-sm btn-outline-success me-2">Depósito</button>
                <button className="btn btn-sm btn-outline-warning me-2">Retiro</button>
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

export default CuentaTable;
