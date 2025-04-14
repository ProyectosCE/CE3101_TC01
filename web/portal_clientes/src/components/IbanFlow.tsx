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
 * Component: IbanFlow
 * Formulario para realizar transferencias IBAN desde una cuenta de origen a una cuenta destino.
 *
 * Props:
 * - onBack: Función para volver a la pantalla anterior.
 * - accounts: Lista de cuentas disponibles para seleccionar como origen (opcional, por defecto ejemplo).
 *
 * Example:
 * <IbanFlow onBack={fn} accounts={accounts} />
 */

import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "@/styles/client.module.css";

interface IbanFlowProps {
  onBack: () => void;
  accounts: { number: string; currency: string }[];
}

export default function IbanFlow({ onBack, accounts }: IbanFlowProps) {
  const [ibanDetails, setIbanDetails] = useState({ origin: "", iban: "", amount: "", detail: "" });

  const handleIbanSubmit = () => {
    if (!ibanDetails.origin || !ibanDetails.iban || !ibanDetails.amount || ibanDetails.detail.length < 20) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }
    console.log("IBAN Transaction:", ibanDetails);
    alert("Transacción procesada exitosamente.");
  };

  return (
    <div className={styles.formContainer}>
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
            {Array.isArray(accounts) &&
              accounts.map((account) => (
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
        <Button className={styles.submitButton} onClick={handleIbanSubmit}>
          Procesar Transacción
        </Button>
      </Form>
      <Button className={styles.backButton} onClick={onBack}>
        Volver
      </Button>
    </div>
  );
}
