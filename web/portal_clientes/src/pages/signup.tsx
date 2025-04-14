import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/signup.module.css";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
 * Page: Signup
 * Página de registro de nuevos clientes para el portal de TecBank.
 *
 * Estructura:
 * - Formulario multietapa para datos personales, bancarios y credenciales.
 *
 * Example:
 * <Signup />
 */

export default function Signup() {
  const [stage, setStage] = useState(1);

  const nextStage = () => setStage((prev) => Math.min(prev + 1, 3));
  const prevStage = () => setStage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Head>
        <title>Signup - TECBANK CLIENTES</title>
        <meta name="description" content="Signup page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          {stage === 1 && (
            <div>
              <h3 className={styles.title}>Información Personal</h3>
              <Form>
                <Form.Group>
                  <Form.Label>Número de Cédula</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Primer Nombre</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Segundo Nombre</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control as="textarea" rows={3} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Teléfonos</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" required />
                </Form.Group>
              </Form>
            </div>
          )}
          {stage === 2 && (
            <div>
              <h3 className={styles.title}>Información de la Cuenta Bancaria</h3>
              <Form>
                <Form.Group>
                  <Form.Label>Tipo de Moneda</Form.Label>
                  <Form.Control as="select" required>
                    <option>Colones</option>
                    <option>Dólares</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Monto de Salario Mensual</Form.Label>
                  <Form.Control type="number" required />
                </Form.Group>
              </Form>
            </div>
          )}
          {stage === 3 && (
            <div>
              <h3 className={styles.title}>Credenciales</h3>
              <Form>
                <Form.Group>
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group>
              </Form>
              <Button className={styles.submitButton} type="submit">
                Registrarse
              </Button>
            </div>
          )}
          <div className={styles.navigationButtons}>
            {stage > 1 && (
              <Button className={styles.navButton} onClick={prevStage}>
                Anterior
              </Button>
            )}
            {stage < 3 && (
              <Button className={styles.navButton} onClick={nextStage}>
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
