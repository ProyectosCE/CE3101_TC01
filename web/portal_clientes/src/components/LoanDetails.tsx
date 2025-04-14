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
 * Component: LoanDetails
 * Muestra los detalles de un préstamo y su historial de pagos.
 *
 * Props:
 * - loan: Objeto con los datos del préstamo.
 * - payments: Lista de pagos realizados para el préstamo.
 * - onBack: Función para volver a la pantalla anterior.
 *
 * Example:
 * <LoanDetails loan={loan} payments={payments} onBack={fn} />
 */

import React from "react";
import { Button, Table, Container } from "react-bootstrap";

interface Loan {
  startDate: string;
  term: number;
  originalAmount: number;
  paidAmount: number;
  annualInterest: number;
}

interface Payment {
  date: string;
  paidAmount: number;
  previousDebt: number;
  currentDebt: number;
}

interface LoanDetailsProps {
  loan: Loan;
  payments: Payment[];
  onBack: () => void;
}

export default function LoanDetails({ loan, payments, onBack }: LoanDetailsProps) {
  return (
    <Container>
      <h2>Detalles del Préstamo</h2>
      <p><strong>Fecha de Inicio:</strong> {loan.startDate}</p>
      <p><strong>Plazo:</strong> {loan.term} cuotas</p>
      <p><strong>Monto Original:</strong> ₡{loan.originalAmount}</p>
      <p><strong>Monto Saldado:</strong> ₡{loan.paidAmount}</p>
      <p><strong>Interés Anual:</strong> {loan.annualInterest}%</p>

      <h3>Historial de Pagos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Monto Saldado</th>
            <th>Deuda Anterior</th>
            <th>Deuda Actual</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.date}</td>
              <td>₡{payment.paidAmount}</td>
              <td>₡{payment.previousDebt}</td>
              <td>₡{payment.currentDebt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={onBack} className="mt-3">
        Volver
      </Button>
    </Container>
  );
}
