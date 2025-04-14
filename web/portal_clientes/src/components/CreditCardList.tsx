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
 * Component: CreditCardList
 * Muestra una tabla con las tarjetas de crédito del cliente y permite seleccionar una para ver detalles.
 *
 * Props:
 * - creditCards: Lista de tarjetas de crédito.
 * - onCardClick: Función a ejecutar al seleccionar una tarjeta.
 *
 * Example:
 * <CreditCardList creditCards={cards} onCardClick={fn} />
 */

import { Table, Button } from "react-bootstrap";
import styles from "@/styles/client.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CreditCardList({ creditCards, onCardClick }) {
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

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1 className={styles.title}>Tarjetas de Crédito</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número de Tarjeta</th>
            <th>Marca</th>
          </tr>
        </thead>
        <tbody>
          {creditCards.map((card) => (
            <tr key={card.number} onClick={() => onCardClick(card.number)}>
              <td>***** {card.number.slice(-4)}</td>
              <td>{card.brand}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className={styles.backButton} onClick={() => router.back()}>
        Volver
      </Button>
    </div>
  );
}
