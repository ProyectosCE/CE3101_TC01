import { useRouter } from "next/router";
import ClientLayout from "@/components/client/ClientLayout";
import IbanFlow from "@/components/IbanFlow";

const exampleAccounts = [
  { number: "123456789", currency: "Colones", balance: 50000 },
  { number: "987654321", currency: "Dólares", balance: 200 },
];

export default function IbanTransferPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/client/transferencias");
  };

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  return (
    <ClientLayout onNavigate={navigateTo}>
      <IbanFlow onBack={handleBack} accounts={exampleAccounts} />
    </ClientLayout>
  );
}
