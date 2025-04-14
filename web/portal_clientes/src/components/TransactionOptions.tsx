import { useRouter } from "next/router";
import { Button, Card, Row, Col } from "react-bootstrap";
import styles from "@/styles/client.module.css";

interface TransactionOptionsProps {
  onBack: () => void;
  onSinpe: () => void;
  onIban: () => void;
}

export default function TransactionOptions({ onBack, onSinpe, onIban }: TransactionOptionsProps) {
  const router = useRouter();

  return (
    <div>
      <h1 className={styles.title}>Enviar Dinero</h1>
      <Row className={styles.cardRow}>
        <Col md={6}>
          <Card className={styles.card} onClick={onIban}>
            <Card.Body>
              <Card.Title>Cuenta IBAN</Card.Title>
              <Card.Text>Realiza transferencias a cuentas IBAN.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={styles.card} onClick={onSinpe}>
            <Card.Body>
              <Card.Title>SINPE Móvil</Card.Title>
              <Card.Text>Envía dinero a través de SINPE Móvil.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Button className={styles.backButton} onClick={onBack}>
        Volver
      </Button>
    </div>
  );
}
