import AdminLayout from '@/components/admin/AdminLayout';
import CuentaForm from '@/components/admin/cuentas/CuentaForm';
import CuentaTable from '@/components/admin/cuentas/CuentaTable';
import { useState } from 'react';
import type { Cuenta } from '@/components/admin/cuentas/CuentaForm'; // Import Cuenta type

const CuentasPage = () => {
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);

  const handleEditCuenta = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
  };

  const handleFormSubmit = () => {
    setSelectedCuenta(null); // Reset after form submission
  };

  return (
    <AdminLayout>
      <h2>Gestión de Cuentas</h2>
      <CuentaForm cuenta={selectedCuenta} onSubmit={handleFormSubmit} />
      <CuentaTable onEditCuenta={handleEditCuenta} />
    </AdminLayout>
  );
};

export default CuentasPage;
