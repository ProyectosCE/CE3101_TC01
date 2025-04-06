import Head from "next/head";
import styles from "@/styles/client.module.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Client() {
  return (
    <>
      <Head>
        <title>Client - TECBANK CLIENTES</title>
        <meta name="description" content="Client page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Portal de Clientes</h1>
        <Container>
          <Row className={styles.cardRow}>
            <Col md={4}>
              <Card className={styles.card}>
                <Card.Body>
                  <Card.Title>Cuentas</Card.Title>
                  <Card.Text>
                    Administra tus cuentas bancarias de forma rápida y segura.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.card}>
                <Card.Body>
                  <Card.Title>Tarjetas de Crédito</Card.Title>
                  <Card.Text>
                    Consulta y gestiona tus tarjetas de crédito fácilmente.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={styles.card}>
                <Card.Body>
                  <Card.Title>Préstamos</Card.Title>
                  <Card.Text>
                    Revisa el estado de tus préstamos y realiza pagos en línea.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
