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
 * Page: TarjetasPage
 * Página de administración para la gestión de tarjetas bancarias.
 *
 * Estructura:
 * - Muestra el formulario para agregar/editar tarjetas.
 * - Muestra la tabla de tarjetas registradas.
 *
 * Example:
 * <TarjetasPage />
 */

import AdminLayout from '@/components/admin/AdminLayout';
import TarjetaForm from '@/components/admin/tarjetas/TarjetaForm';
import TarjetaTable from '@/components/admin/tarjetas/TarjetaTable';

const TarjetasPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Tarjetas</h2>
      <TarjetaForm />
      <TarjetaTable />
    </AdminLayout>
  );
};

export default TarjetasPage;
