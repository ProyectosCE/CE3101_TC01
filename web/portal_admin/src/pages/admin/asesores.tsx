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
 * Page: AsesoresPage
 * Página de administración para la gestión de asesores de crédito.
 *
 * Estructura:
 * - Muestra el formulario para agregar/editar asesores.
 * - Muestra la tabla de asesores registrados.
 *
 * Example:
 * <AsesoresPage />
 */

import AdminLayout from '@/components/admin/AdminLayout';
import AsesorForm from '@/components/admin/asesores/AsesorForm';
import AsesorTable from '@/components/admin/asesores/AsesorTable';

const AsesoresPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Asesores de Crédito</h2>
      <AsesorForm />
      <AsesorTable />
    </AdminLayout>
  );
};

export default AsesoresPage;
