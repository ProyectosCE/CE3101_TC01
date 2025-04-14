import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Portal Administrativo - TecBank</title>
        <meta name="description" content="TecBank Admin Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: "2rem" }}>
        <h1>Bienvenido al Portal Administrativo de TecBank</h1>
        <p>Por favor accede a <code>/admin</code> para comenzar a administrar.</p>
      </main>
    </>
  );
}
