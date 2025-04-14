import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';

// Define the Cliente type
type Cliente = {
  id_cliente: number;
  cedula: string;
  direccion: string;
  telefono: string;
  ingreso_mensual: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  nombreCompleto: string;
  tipo_id: string;
};

type ClienteTableProps = {
  onEditCliente: (cliente: Cliente) => void; // Add onEditCliente prop
};

const ClienteTable = ({ onEditCliente }: ClienteTableProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Explicitly use HTTP endpoint
        const response = await fetch(`${API_ENDPOINT}Clientes`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Cliente[] = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
        setError('Failed to fetch client data. Please try again later.');
      }
    };

    fetchClientes();
  }, []);

  const handleDeleteCliente = async (cliente: Cliente) => {
    const apiUrl = `${API_ENDPOINT}Clientes?tipo=borrar`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente), // Send full client data
      });

      if (response.ok) {
        window.location.reload(); // Reload the page on success
      } else {
        console.error('Error deleting cliente:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

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
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.nombreCompleto}</td>
              <td>{cliente.cedula}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.tipo_id}</td>
              <td>{cliente.usuario}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEditCliente(cliente)} // Pass client to edit
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteCliente(cliente)} // Pass full client data
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

export default ClienteTable;
