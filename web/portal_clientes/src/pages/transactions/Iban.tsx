import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import styles from "@/styles/client.module.css";

const exampleAccounts = [
  { number: "123456789", currency: "Colones", balance: 50000 },
  { number: "987654321", currency: "Dólares", balance: 200 },
];

export default function Iban({ accounts = exampleAccounts }) {
  const router = useRouter();
  const { query } = router;
  const [ibanDetails, setIbanDetails] = useState({ origin: "", iban: "", amount: "", detail: "" });

  useEffect(() => {
    if (!query.page || query.page !== "iban") {
      router.push("/client?page=transferencias");
    }
  }, [query.page]);

  const handleIbanSubmit = () => {
    console.log("IBAN Transaction:", ibanDetails);
  };

  const handleBack = () => {
    router.push("/client?page=transferencias");
  };

  return (
    <div>
      <h1 className={styles.title}>Transferencia IBAN</h1>
      <Form>
        <Form.Group>
          <Form.Label>Cuenta de Origen</Form.Label>
          <Form.Control
            as="select"
            value={ibanDetails.origin}
            onChange={(e) => setIbanDetails({ ...ibanDetails, origin: e.target.value })}
          >
            <option value="">Seleccione una cuenta</option>
            {Array.isArray(accounts) &&
              accounts.map((account) => (
                <option key={account.number} value={account.number}>
                  {account.number} - {account.currency}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Cuenta IBAN de Destino</Form.Label>
          <Form.Control
            type="text"
            value={ibanDetails.iban}
            onChange={(e) => setIbanDetails({ ...ibanDetails, iban: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            value={ibanDetails.amount}
            onChange={(e) => setIbanDetails({ ...ibanDetails, amount: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Detalle (mínimo 20 caracteres)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={ibanDetails.detail}
            onChange={(e) => setIbanDetails({ ...ibanDetails, detail: e.target.value })}
          />
        </Form.Group>
        <Button onClick={handleIbanSubmit}>Procesar Transacción</Button>
      </Form>
      <Button className={styles.backButton} onClick={handleBack}>
        Volver
      </Button>
    </div>
  );
}
