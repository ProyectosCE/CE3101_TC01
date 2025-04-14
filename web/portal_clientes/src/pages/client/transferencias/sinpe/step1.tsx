import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Modal } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function Step1() {
  const router = useRouter();
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "" });
  const [showModal, setShowModal] = useState(false);

  const sinpeDirectory: Record<string, string> = {
    "8888": "Francisco Duran",
    "7856": "Catalina Ramirez",
  };

  const handleSinpeVerify = () => {
    const name = sinpeDirectory[sinpeDetails.phone];
    if (name) {
      setSinpeDetails({ ...sinpeDetails, name });
      sessionStorage.setItem("sinpeDetails", JSON.stringify({ phone: sinpeDetails.phone, name }));
      router.push("/client/transferencias/sinpe/step2");
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h1 className={styles.title}>SINPE Móvil - Paso 1</h1>
      <Form>
        <Form.Group>
          <Form.Label>Número de Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={sinpeDetails.phone}
            onChange={(e) => setSinpeDetails({ phone: e.target.value, name: "" })}
          />
        </Form.Group>
        <Button onClick={handleSinpeVerify}>Verificar</Button>
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
  );
}
