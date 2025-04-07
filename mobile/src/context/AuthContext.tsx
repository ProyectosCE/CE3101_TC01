import React, { createContext, useContext, useState } from 'react';
import rawUsers from '../data/users.json';

type Cuenta = {
  id: string;
  tipo: 'Credito' | 'Debito';
  numero: string;
  saldo: number;
};

type Cliente = {
  id_cliente: string;
  Nombre_Completo: string;
  Cedula: string;
  direccion: string;
  telefono: string;
  ingreso_mensual: number;
  tipo_cliente: 'Fisico' | 'Juridico';
  usuario: string;
  password: string;
  cuentas: Cuenta[];
};

type AuthContextType = {
  cliente: Cliente | null;
  login: (cedula: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  cliente: null,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const users = rawUsers as Cliente[];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const login = (cedula: string, password: string): boolean => {
    const found = users.find(
      (u) => u.Cedula === cedula && u.password === password
    );
    if (found) {
      setCliente(found);
      return true;
    }
    return false;
  };

  const logout = () => setCliente(null);

  return (
    <AuthContext.Provider value={{ cliente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
