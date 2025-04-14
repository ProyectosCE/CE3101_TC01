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
 * Page: PrestamosPage
 * Página de administración para la gestión de préstamos.
 *
 * Estructura:
 * - Muestra el formulario para agregar/editar préstamos.
 * - Muestra la tabla de préstamos registrados.
 *
 * Example:
 * <PrestamosPage />
 */

import AdminLayout from '@/components/admin/AdminLayout';
import PrestamoForm from '@/components/admin/prestamos/PrestamoForm';
import PrestamoTable from '@/components/admin/prestamos/PrestamoTable';

const PrestamosPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Préstamos</h2>
      <PrestamoForm />
      <PrestamoTable />
    </AdminLayout>
  );
};

export default PrestamosPage;
