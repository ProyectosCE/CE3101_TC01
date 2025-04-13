import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Form, Card, Modal } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function SinpeFlow({ onBack }) {
  const router = useRouter();
  const { query } = router;
  const [step, setStep] = useState(1);
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "", amount: "", detail: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const currentStep = parseInt(query.step || "1", 10);
    if (currentStep > step + 1) {
      // Prevent skipping steps
      router.push(`/client?page=transferencias&type=sinpe&step=${step}`);
    } else {
      setStep(currentStep);
    }
  }, [query.step, step, router]);

  const handleNextStep = (nextStep) => {
    setStep(nextStep);
    router.push(`/client?page=transferencias&type=sinpe&step=${nextStep}`);
  };

  const handleSinpeVerify = () => {
    const name = sinpeDirectory[sinpeDetails.phone];
    if (name) {
      setSinpeDetails({ ...sinpeDetails, name });
      handleNextStep(2);
    } else {
      setShowModal(true);
    }
  };

  const handleSinpeSubmit = () => {
    console.log("SINPE Transaction:", sinpeDetails);
    handleNextStep(1);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      handleNextStep(step - 1);
    }
  };

  const sinpeDirectory = {
    "8888": "Francisco Duran",
    "7856": "Catalina Ramirez",
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h1 className={styles.title}>SINPE Móvil</h1>
          <Form>
            <Form.Group>
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={sinpeDetails.phone}
                onChange={(e) => setSinpeDetails({ phone: e.target.value, name: "", amount: "", detail: "" })}
              />
            </Form.Group>
            <Button onClick={handleSinpeVerify}>Verificar</Button>
            <Button className={styles.backButton} onClick={handleBack}>
              Volver
            </Button>
          </Form>
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>Este número no se encuentra asociado a ninguna cuenta SINPE MÓVIL.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1 className={styles.title}>SINPE Móvil</h1>
          <Card className={styles.card}>
            <Card.Body>
              <Card.Title>Nombre del Destinatario</Card.Title>
              <Card.Text>{sinpeDetails.name}</Card.Text>
              <Button onClick={() => handleNextStep(3)}>Continuar</Button>
              <Button className={styles.backButton} onClick={handleBack}>
                Volver
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}
      {step === 3 && (
        <div>
          <h1 className={styles.title}>SINPE Móvil</h1>
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
              <Form.Label>Detalle (máximo 20 caracteres)</Form.Label>
              <Form.Control
                type="text"
                value={sinpeDetails.detail}
                onChange={(e) => setSinpeDetails({ ...sinpeDetails, detail: e.target.value })}
              />
            </Form.Group>
            <Button onClick={handleSinpeSubmit}>Procesar Transacción</Button>
            <Button className={styles.backButton} onClick={handleBack}>
              Volver
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
