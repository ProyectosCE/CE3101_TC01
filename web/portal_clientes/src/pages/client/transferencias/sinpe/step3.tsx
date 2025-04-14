import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function Step3() {
  const router = useRouter();
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "", amount: "", detail: "" });

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("sinpeDetails");
    if (!storedDetails) {
      router.push("/client/transferencias/sinpe/step1");
    } else {
      setSinpeDetails(JSON.parse(storedDetails));
    }
  }, [router]);

  const handleSubmit = () => {
    console.log("SINPE Transaction:", sinpeDetails);
    sessionStorage.removeItem("sinpeDetails");
    router.push("/client/transferencias/sinpe/step1");
  };

  const handleBack = () => {
    router.push("/client/transferencias/sinpe/step2");
  };

  return (
    <div>
      <h1 className={styles.title}>SINPE Móvil - Paso 3</h1>
      <Form>
        <Form.Group>
          <Form.Label>Número de Teléfono</Form.Label>
          <Form.Control type="text" value={sinpeDetails.phone} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nombre del Destinatario</Form.Label>
          <Form.Control type="text" value={sinpeDetails.name} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Monto (en colones)</Form.Label>
          <Form.Control
            type="number"
            value={sinpeDetails.amount}
            onChange={(e) => setSinpeDetails({ ...sinpeDetails, amount: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Detalle</Form.Label>
          <Form.Control
            type="text"
            value={sinpeDetails.detail}
            onChange={(e) => setSinpeDetails({ ...sinpeDetails, detail: e.target.value })}
          />
        </Form.Group>
        <Button onClick={handleSubmit}>Procesar Transacción</Button>
        <Button className={styles.backButton} onClick={handleBack}>
          Volver
        </Button>
      </Form>
    </div>
  );
}
