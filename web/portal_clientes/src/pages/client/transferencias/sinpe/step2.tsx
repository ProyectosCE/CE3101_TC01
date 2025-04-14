import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function Step2() {
  const router = useRouter();
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "" });

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("sinpeDetails");
    if (!storedDetails) {
      router.push("/client/transferencias/sinpe/step1");
    } else {
      setSinpeDetails(JSON.parse(storedDetails));
    }
  }, [router]);

  const handleNextStep = () => {
    router.push("/client/transferencias/sinpe/step3");
  };

  const handleBack = () => {
    router.push("/client/transferencias/sinpe/step1");
  };

  return (
    <div>
      <h1 className={styles.title}>SINPE Móvil - Paso 2</h1>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>Nombre del Destinatario</Card.Title>
          <Card.Text>{sinpeDetails.name}</Card.Text>
          <Button onClick={handleNextStep}>Continuar</Button>
          <Button className={styles.backButton} onClick={handleBack}>
            Volver
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
