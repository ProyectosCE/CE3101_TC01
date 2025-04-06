import { useState } from "react";
import { Button, Form, Card, Row, Col, Alert, Modal } from "react-bootstrap";
import styles from "@/styles/client.module.css";

export default function TransactionOptions({ onBack, accounts }) {
  const [flow, setFlow] = useState(""); // "iban" or "sinpe"
  const [step, setStep] = useState(1);
  const [ibanDetails, setIbanDetails] = useState({ origin: "", iban: "", amount: "", detail: "" });
  const [sinpeDetails, setSinpeDetails] = useState({ phone: "", name: "", amount: "", detail: "" });
  const [showModal, setShowModal] = useState(false);

  const sinpeDirectory = {
    "8888": "Francisco Duran",
    "7856": "Catalina Ramirez",
  };

  const handleIbanSubmit = () => {
    console.log("IBAN Transaction:", ibanDetails);
  };

  const handleSinpeVerify = () => {
    const name = sinpeDirectory[sinpeDetails.phone];
    if (name) {
      setSinpeDetails({ ...sinpeDetails, name });
      setStep(2); // Move to the recipient verification stage
    } else {
      setShowModal(true); // Show modal for invalid phone number
    }
  };

  const handleSinpeSubmit = () => {
    console.log("SINPE Transaction:", sinpeDetails);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const resetSinpeDetails = () => {
    setSinpeDetails({ phone: "", name: "", amount: "", detail: "" });
    setStep(1);
  };

  return (
    <div>
      {flow === "" && (
        <div>
          <h1 className={styles.title}>Enviar Dinero</h1>
          <Row className={styles.cardRow}>
            <Col md={6}>
              <Card className={styles.card} onClick={() => { setFlow("iban"); setStep(1); }}>
                <Card.Body>
                  <Card.Title>Cuenta IBAN</Card.Title>
                  <Card.Text>Realiza transferencias a cuentas IBAN.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className={styles.card} onClick={() => { setFlow("sinpe"); resetSinpeDetails(); }}>
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
      )}
      {flow === "iban" && step === 1 && (
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
                {accounts.map((account) => (
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
          <Button className={styles.backButton} onClick={() => setFlow("")}>
            Volver
          </Button>
        </div>
      )}
      {flow === "sinpe" && step === 1 && (
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
            <Button className={styles.backButton} onClick={() => setFlow("")}>
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
      {flow === "sinpe" && step === 2 && (
        <div>
          <h1 className={styles.title}>SINPE Móvil</h1>
          <Card className={styles.card}>
            <Card.Body>
              <Card.Title>Nombre del Destinatario</Card.Title>
              <Card.Text>{sinpeDetails.name}</Card.Text>
              <Button onClick={() => setStep(3)}>Continuar</Button>
              <Button className={styles.backButton} onClick={() => setStep(1)}>
                Volver
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}
      {flow === "sinpe" && step === 3 && (
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
            <Button className={styles.backButton} onClick={() => setStep(2)}>
              Volver
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
