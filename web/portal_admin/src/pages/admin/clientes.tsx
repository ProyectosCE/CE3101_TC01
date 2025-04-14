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

import AdminLayout from '@/components/admin/AdminLayout';
import ClienteForm from '@/components/admin/clientes/ClienteForm';
import ClienteTable from '@/components/admin/clientes/ClienteTable';

const ClientesPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Clientes</h2>
      <ClienteForm />
      <ClienteTable />
    </AdminLayout>
  );
};

export default ClientesPage;
