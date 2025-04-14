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
 * Page: MoraPage
 * Página de administración para la gestión y reporte de clientes en mora.
 *
 * Estructura:
 * - Muestra la tabla de reporte de mora.
 *
 * Example:
 * <MoraPage />
 */

import AdminLayout from '@/components/admin/AdminLayout';
import ReporteMoraTable from '@/components/admin/mora/ReporteMoraTable';

const MoraPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Mora</h2>
      <ReporteMoraTable />
    </AdminLayout>
  );
};

export default MoraPage;
