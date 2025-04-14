import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClienteForm from '@/components/admin/clientes/ClienteForm';
import ClienteTable from '@/components/admin/clientes/ClienteTable';

const ClientesPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddClienteClick = () => {
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  const handleFormSubmit = () => {
    setShowForm(false); // Close the form
  };

  return (
    <AdminLayout>
      <h2>Gestión de Clientes</h2>
      {!showForm ? (
        <>
          <div className="mb-4">
            <h4>Añadir Cliente</h4>
            <p>Presiona el botón para añadir un nuevo cliente al sistema.</p>
            <button className="btn btn-primary" onClick={handleAddClienteClick}>
              Añadir Cliente
            </button>
          </div>
          <ClienteTable />
        </>
      ) : (
        <>
          <button className="btn btn-secondary mb-3" onClick={handleBackToList}>
            Volver a la Lista
          </button>
          <ClienteForm onSubmit={handleFormSubmit} />
        </>
      )}
    </AdminLayout>
  );
};

export default ClientesPage;
