import { useRouter } from "next/router";
import ClientLayout from "@/components/client/ClientLayout";
import SinpeFlow from "@/components/SinpeFlow";

export default function SinpeTransferPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/client/transferencias");
  };

  const navigateTo = (path: string) => {
    router.push(`/client/${path}`);
  };

  return (
    <ClientLayout onNavigate={navigateTo}>
      <SinpeFlow onBack={handleBack} />
    </ClientLayout>
  );
}
