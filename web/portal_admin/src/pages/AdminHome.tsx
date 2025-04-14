import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminHome = () => {
  return (
    <AdminLayout>
      <div className="container mt-4">
        <h1>Bienvenido al Portal Administrativo</h1>
        <p>Utilice el menú lateral para navegar entre las diferentes secciones:</p>
        <ul>
          <li>Clientes - Gestión de clientes del banco</li>
          <li>Cuentas - Administración de cuentas bancarias</li>
          <li>Tarjetas - Control de tarjetas de crédito y débito</li>
          <li>Asesores - Gestión de asesores de crédito</li>
          <li>Préstamos - Administración de préstamos</li>
          <li>Morosidad - Control de cuentas en estado moroso</li>
        </ul>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
