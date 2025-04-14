/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Page: Sinpe
 * Página para el flujo de transferencia por SINPE Móvil, dividida en pasos.
 *
 * Example:
 * <Sinpe />
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Form, Card, Modal } from "react-bootstrap";
import styles from "@/styles/client.module.css";

interface SinpeDetails {
  phone: string;
  name: string;
  amount: string;
  detail: string;
}

type SinpeDirectory = {
  [key in "8888" | "7856"]: string;
};

export default function Sinpe() {
  const router = useRouter();
  const { query } = router;
  const [step, setStep] = useState(1);
  const [sinpeDetails, setSinpeDetails] = useState<SinpeDetails>({ phone: "", name: "", amount: "", detail: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stepQuery = Array.isArray(query.step) ? query.step[0] : query.step;
    const currentStep = parseInt(stepQuery || "1", 10);
    if (currentStep > step) {
      // Prevent skipping steps
      router.push(`/transactions/Sinpe?step=${step}`);
    } else {
      setStep(currentStep);
    }
  }, [query.step, step, router]);

  const handleNextStep = (nextStep: number) => {
    setStep(nextStep);
    router.push(`/transactions/Sinpe?step=${nextStep}`);
  };

  const handleSinpeVerify = () => {
    const name = sinpeDetails.phone in sinpeDirectory ? sinpeDirectory[sinpeDetails.phone as keyof SinpeDirectory] : undefined;
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
      router.push("/client?page=transferencias");
    } else {
      handleNextStep(step - 1);
    }
  };

  const sinpeDirectory: SinpeDirectory = {
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
