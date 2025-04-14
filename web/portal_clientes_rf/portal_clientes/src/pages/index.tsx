import ClienteLayout from '@/components/cliente/ClienteLayout';

const ClienteHome = () => {
  return (
    <ClienteLayout>
      <div className="p-4">
        <h2>Bienvenido al Portal de Clientes de TecBank</h2>
        <p>Utiliza el menú lateral para acceder a las secciones de servicios financieros.</p>
      </div>
    </ClienteLayout>
  );
};

export default ClienteHome;

