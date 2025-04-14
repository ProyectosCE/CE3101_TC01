import AdminLayout from '@/components/admin/AdminLayout';
import CuentaForm from '@/components/admin/cuentas/CuentaForm';
import CuentaTable from '@/components/admin/cuentas/CuentaTable';

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
