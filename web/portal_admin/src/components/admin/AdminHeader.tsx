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
 * Component: AdminHeader
 * Encabezado principal del panel de administración.
 *
 * Props:
 * - Ninguna (el encabezado es estático y no recibe props en esta versión).
 *
 * Example:
 * <AdminHeader />
 */

const AdminHeader = () => {
  return (
    <header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Panel de Administración</h5>
      <div>
        {}
      </div>
    </header>
  );
};

export default AdminHeader;
