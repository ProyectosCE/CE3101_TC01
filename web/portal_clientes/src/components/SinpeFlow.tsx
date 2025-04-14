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
 * Component: SinpeFlow
 * Flujo de formulario para realizar transferencias por SINPE Móvil.
 *
 * Props:
 * - onBack: Función para volver a la pantalla anterior.
 *
 * Example:
 * <SinpeFlow onBack={fn} />
 */

import { useState, useEffect } from "react";
import { Button, Form, Card, Modal, Container, Row, Col } from "react-bootstrap";
import styles from "@/styles/client.module.css";

interface SinpeFlowProps {
  onBack: () => void;
}

export default function SinpeFlow({ onBack }: SinpeFlowProps) {
  const [step, setStep] = useState(1);
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "", amount: "", detail: "" });
  const [showModal, setShowModal] = useState(false);

  const sinpeDirectory: Record<string, string> = {
    "8888": "Francisco Duran",
    "7856": "Catalina Ramirez",
  };

  useEffect(() => {
    // Sync step with URL on mount
    const urlStep = Number(new URLSearchParams(window.location.search).get("step")) || 1;
    setStep(urlStep);

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const urlStep = Number(new URLSearchParams(window.location.search).get("step")) || 1;
      setStep(urlStep);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const updateStepInUrl = (newStep: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", newStep.toString());
    window.history.pushState({ step: newStep }, "", url.toString());
  };

  const handleNextStep = () => {
    if (step === 1) {
      const name = sinpeDirectory[sinpeDetails.phone];
      if (name) {
        setSinpeDetails({ ...sinpeDetails, name });
        const nextStep = 2;
        setStep(nextStep);
        updateStepInUrl(nextStep);
      } else {
        setShowModal(true);
      }
      return;
    }
    if (step === 2 && !sinpeDetails.name) {
      alert("Debe verificar el número de teléfono antes de continuar.");
      return;
    }
    if (step === 3 && (!sinpeDetails.amount || sinpeDetails.detail.length < 1)) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    updateStepInUrl(nextStep);
  };

  const handleBackStep = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    updateStepInUrl(prevStep);
  };

  const handleSinpeSubmit = () => {
    console.log("SINPE Transaction:", sinpeDetails);
    alert("Transacción procesada exitosamente.");
    setStep(1); // Reset to step 1 after submission
    setSinpeDetails({ phone: "", name: "", amount: "", detail: "" });
    updateStepInUrl(1);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {step === 1 && (
            <div>
              <h1 className={styles.title}>SINPE Móvil - Paso 1</h1>
              <Form className="mt-4">
                <Form.Group>
                  <Form.Label>Número de Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={sinpeDetails.phone}
                    onChange={(e) => setSinpeDetails({ phone: e.target.value, name: "", amount: "", detail: "" })}
                  />
                </Form.Group>
                <Form.Group className="d-flex justify-content-end mt-3">
                  <Button onClick={handleNextStep} className="me-2">Verificar y Continuar</Button>
                  <Button className={styles.backButton} onClick={onBack}>
                    Volver
                  </Button>
                </Form.Group>
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
              <h1 className={styles.title}>SINPE Móvil - Paso 2</h1>
              <Card className={`${styles.card} mt-4`}>
                <Card.Body>
                  <Card.Title>Nombre del Destinatario</Card.Title>
                  <Card.Text>{sinpeDetails.name}</Card.Text>
                  <Form.Group className="d-flex justify-content-end mt-3">
                    <Button onClick={handleNextStep} className="me-2">Continuar</Button>
                    <Button className={styles.backButton} onClick={handleBackStep}>
                      Volver
                    </Button>
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          )}
          {step === 3 && (
            <div>
              <h1 className={styles.title}>SINPE Móvil - Paso 3</h1>
              <Form className="mt-4">
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
                <Form.Group className="d-flex justify-content-end mt-3">
                  <Button onClick={handleSinpeSubmit} className="me-2">Procesar Transacción</Button>
                  <Button className={styles.backButton} onClick={handleBackStep}>
                    Volver
                  </Button>
                </Form.Group>
              </Form>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
