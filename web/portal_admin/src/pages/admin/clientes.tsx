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
 * Page: ClientesPage
 * Página de administración para la gestión de clientes.
 *
 * Estructura:
 * - Muestra el formulario para agregar/editar clientes.
 * - Muestra la tabla de clientes registrados.
 *
 * Example:
 * <ClientesPage />
 */

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClienteForm from '@/components/admin/clientes/ClienteForm';
import ClienteTable from '@/components/admin/clientes/ClienteTable';

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

const ClientesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null); // Track the client being edited

  const handleAddClienteClick = () => {
    setShowForm(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setEditingCliente(null); // Clear the editing client
  };

  const handleFormSubmit = () => {
    setShowForm(false); // Close the form
    setEditingCliente(null); // Clear the editing client
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
          <ClienteTable onEditCliente={handleEditCliente} />
        </>
      ) : (
        <>
          <button className="btn btn-secondary mb-3" onClick={handleBackToList}>
            Volver a la Lista
          </button>
          <ClienteForm onSubmit={handleFormSubmit} editingCliente={editingCliente} />
        </>
      )}
    </AdminLayout>
  );
};

export default ClientesPage;
