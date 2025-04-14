import AdminLayout from '@/components/admin/AdminLayout';
import ClienteForm from '@/components/admin/clientes/ClienteForm';
import ClienteTable from '@/components/admin/clientes/ClienteTable';

const ClientesPage = () => {
  return (
    <AdminLayout>
      <h2>Gestión de Clientes</h2>
      <ClienteForm />
      <ClienteTable />
    </AdminLayout>
  );
};

export default ClientesPage;
