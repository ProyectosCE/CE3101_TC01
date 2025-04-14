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
 * Page: Sinpe (Transferencia SINPE Móvil)
 * Página para el flujo de transferencia por SINPE Móvil, dividida en pasos.
 *
 * Props:
 * - onBack: Función para volver a la pantalla anterior (opcional).
 *
 * Example:
 * <Sinpe onBack={fn} />
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Form, Card, Modal } from "react-bootstrap";
import styles from "@/styles/client.module.css";

interface SinpeProps {
  onBack?: () => void;
}

interface SinpeDetails {
  phone: string;
  name: string;
  amount: string;
  detail: string;
}

type SinpeDirectory = {
  [key in "8888" | "7856"]: string;
};

export default function Sinpe({ onBack }: SinpeProps) {
  const [sinpeDetails, setSinpeDetails] = useState<SinpeDetails>({ phone: "", name: "", amount: "", detail: "" });
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { step } = router.query;

  const sinpeDirectory: SinpeDirectory = {
    "8888": "Francisco Duran",
    "7856": "Catalina Ramirez",
  };

  const currentStep = parseInt(Array.isArray(step) ? step[0] : step || "1");

  useEffect(() => {
    // Redirect to step 1 if accessing a step without completing the previous one
    if (currentStep === 2 && !sinpeDetails.phone) router.push("/transactions/sinpe/step1");
    if (currentStep === 3 && !sinpeDetails.name) router.push("/transactions/sinpe/step2");
  }, [currentStep, sinpeDetails, router]);

  const handleSinpeVerify = () => {
    const name = sinpeDetails.phone in sinpeDirectory 
      ? sinpeDirectory[sinpeDetails.phone as keyof SinpeDirectory] 
      : undefined;
    if (name) {
      setSinpeDetails({ ...sinpeDetails, name });
      router.push("/transactions/sinpe/step2");
    } else {
      setShowModal(true);
    }
  };

  const handleSinpeSubmit = () => {
    console.log("SINPE Transaction:", sinpeDetails);
    router.push("/transactions/sinpe/step1"); // Reset to step 1 after submission
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      {currentStep === 1 && (
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
            <Button className={styles.backButton} onClick={onBack}>
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
      {currentStep === 2 && (
        <div>
          <h1 className={styles.title}>SINPE Móvil</h1>
          <Card className={styles.card}>
            <Card.Body>
              <Card.Title>Nombre del Destinatario</Card.Title>
              <Card.Text>{sinpeDetails.name}</Card.Text>
              <Button onClick={() => router.push("/transactions/sinpe/step3")}>Continuar</Button>
              <Button className={styles.backButton} onClick={() => router.push("/transactions/sinpe/step1")}>
                Volver
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}
      {currentStep === 3 && (
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
            <Button className={styles.backButton} onClick={() => router.push("/transactions/sinpe/step2")}>
              Volver
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
