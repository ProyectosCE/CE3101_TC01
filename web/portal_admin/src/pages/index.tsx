import { useState, useEffect, createContext } from 'react';
import LoginPage from './login';
import AdminHome from './AdminHome';

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

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  useEffect(() => {
    // Simulate session check (replace with real authentication logic)
    const session = localStorage.getItem('session');
    setIsLoggedIn(!!session);
    setIsLoading(false); // Finaliza la carga una vez que se verifica la sesión
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
