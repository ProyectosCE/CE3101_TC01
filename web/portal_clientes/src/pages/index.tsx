import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Client from './client/index';
import LoginPage from './login/index';

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
 * Page: Home (Login de Clientes)
 * Página de inicio de sesión para el portal de clientes de TecBank.
 *
 * Estructura:
 * - Formulario para ingresar usuario y contraseña.
 * - Enlaces para registro y recuperación de contraseña.
 *
 * Example:
 * <Home />
 */

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})
const Index = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Client /> : <LoginPage />;
};

export default Index;
