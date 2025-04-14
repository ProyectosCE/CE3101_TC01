import ClienteLayout from '@/components/cliente/ClienteLayout';
import PagoTarjetaForm from '@/components/cliente/tarjetas/PagoTarjetaForm';

export default function TarjetasPage() {
  return (
    <ClienteLayout>
      <h2>Pago de Tarjetas</h2>
      <PagoTarjetaForm />
    </ClienteLayout>
  );
}
