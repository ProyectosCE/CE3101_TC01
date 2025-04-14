import AdminLayout from '@/components/admin/AdminLayout';
import AsesorForm from '@/components/admin/asesores/AsesorForm';
import AsesorTable from '@/components/admin/asesores/AsesorTable';

const AsesoresPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Asesores de Crédito</h2>
      <AsesorForm />
      <AsesorTable />
    </AdminLayout>
  );
};

export default AsesoresPage;
