import AdminLayout from '@/components/admin/AdminLayout';

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
