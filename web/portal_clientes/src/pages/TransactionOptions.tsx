import { useRouter } from "next/router";
import { Button, Card, Row, Col } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useEffect } from "react";

export default function TransactionOptions() {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      router.back();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div>
      <h1 className={styles.title}>Enviar Dinero</h1>
      <Row className={styles.cardRow}>
        <Col md={6}>
          <Card className={styles.card} onClick={() => router.push("/transactions/Iban")}>
            <Card.Body>
              <Card.Title>Cuenta IBAN</Card.Title>
              <Card.Text>Realiza transferencias a cuentas IBAN.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={styles.card} onClick={() => router.push("/transactions/Sinpe")}>
            <Card.Body>
              <Card.Title>SINPE Móvl</Card.Title>
              <Card.Text>Envía dinero a través de SINPE Móvil.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Button className={styles.backButton} onClick={() => router.back()}>
        Volver
      </Button>
    </div>
  );
}
