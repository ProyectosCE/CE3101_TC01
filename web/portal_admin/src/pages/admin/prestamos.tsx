import AdminLayout from '@/components/admin/AdminLayout';
import PrestamoForm from '@/components/admin/prestamos/PrestamoForm';
import PrestamoTable from '@/components/admin/prestamos/PrestamoTable';

const PrestamosPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Préstamos</h2>
      <PrestamoForm />
      <PrestamoTable />
    </AdminLayout>
  );
};

export default PrestamosPage;
