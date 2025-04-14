import { useRouter } from "next/router";
import IbanFlow from "@/components/IbanFlow";

const exampleAccounts = [
  { number: "123456789", currency: "Colones", balance: 50000 },
  { number: "987654321", currency: "Dólares", balance: 200 },
];

export default function Iban() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/client?page=transferencias");
  };

  return (
    <IbanFlow onBack={handleBack} accounts={exampleAccounts} />
  );
}
