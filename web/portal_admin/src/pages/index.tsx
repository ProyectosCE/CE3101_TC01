import AdminLayout from '@/components/admin/AdminLayout';

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
 * Page: AdminHome
 * Página principal del portal administrativo de TecBank.
 *
 * Estructura:
 * - Muestra mensaje de bienvenida y guía para el uso del menú lateral.
 *
 * Example:
 * <AdminHome />
 */

const AdminHome = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2>Bienvenido al Portal Administrativo de TecBank</h2>
        <p>Utiliza el menú lateral para acceder a las secciones de administración.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
