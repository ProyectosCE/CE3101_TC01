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
 * Component: AdminLayout
 * Layout principal para las páginas del panel de administración, incluye barra lateral y encabezado.
 *
 * Props:
 * - children: ReactNode - Contenido a renderizar dentro del layout.
 *
 * Example:
 * <AdminLayout>
 *   <div>Contenido</div>
 * </AdminLayout>
 */

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <AdminHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
