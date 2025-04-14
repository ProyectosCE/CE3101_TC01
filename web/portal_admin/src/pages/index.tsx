import { useState, useEffect, createContext } from 'react';
import dynamic from 'next/dynamic';
import LoginPage from './login';

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
 * Page: AdminHome
 * Página principal del portal administrativo de TecBank.
 *
 * Estructura:
 * - Muestra mensaje de bienvenida y guía para el uso del menú lateral.
 *
 * Example:
 * <AdminHome />
 */

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
});

// Importar AdminHome dinámicamente para evitar problemas de hidratación
const AdminHome = dynamic(() => import('./AdminHome'), {
  ssr: false,
});

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si estamos en el cliente
      const session = localStorage.getItem('session');
      setIsLoggedIn(!!session);
      setIsLoading(false); // Finaliza la carga una vez que se verifica la sesión
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Mostrar un indicador de carga mientras se verifica la sesión
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isLoggedIn ? <AdminHome /> : <LoginPage />}
    </AuthContext.Provider>
  );
};

export default Index;
