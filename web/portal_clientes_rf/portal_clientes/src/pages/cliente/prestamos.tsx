import ClienteLayout from '@/components/cliente/ClienteLayout';
import PrestamoPagoForm from '@/components/cliente/prestamos/PrestamoPagoForm';

export default function PrestamosPage() {
  return (
    <ClienteLayout>
      <h2>Pago de Préstamos</h2>
      <PrestamoPagoForm />
    </ClienteLayout>
  );
}
