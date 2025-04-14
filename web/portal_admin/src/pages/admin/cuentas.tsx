import AdminLayout from '@/components/admin/AdminLayout';
import CuentaForm from '@/components/admin/cuentas/CuentaForm';
import CuentaTable from '@/components/admin/cuentas/CuentaTable';

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
 * Page: CuentasPage
 * Página de administración para la gestión de cuentas bancarias.
 *
 * Estructura:
 * - Muestra el formulario para agregar/editar cuentas.
 * - Muestra la tabla de cuentas registradas.
 *
 * Example:
 * <CuentasPage />
 */

const CuentasPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Cuentas</h2>
      <CuentaForm />
      <CuentaTable />
    </AdminLayout>
  );
};

export default CuentasPage;
