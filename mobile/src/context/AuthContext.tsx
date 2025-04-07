import React, { createContext, useContext, useState, useCallback } from 'react';
import rawUsers from '../data/users.json';

type Currency = 'Dolares' | 'Colones' | 'Euros';
type AccountType = 'Credito' | 'Debito';
type ClientType = 'Fisico' | 'Juridico';

interface Movimiento {
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: 'deposito' | 'retiro' | 'transferencia';
}

interface Cuenta {
  id: string;
  currency: Currency;
  tipo: AccountType;
  numero: string;
  saldo: number;
  movimientos?: Movimiento[];
}

interface TarjetaCredito {
  id: string;
  numero: string;
  tipo: 'Credito';
  limite: number;
  saldo: number;
  fecha_vencimiento: string;
  codigo_seguridad: string;
  cuenta_asociada?: string;
}

interface TarjetaDebito {
  id: string;
  numero: string;
  tipo: 'Debito';
  cuenta_asociada: string;
  saldo: number;
}

interface PrestamoCuota {
  numero: number;
  fecha: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

interface Prestamo {
  id: string;
  monto: number;
  saldo_pendiente: number;
  tasa_interes: number;
  fecha_inicio: string;
  cuotas: PrestamoCuota[];
}

interface Cliente {
  id_cliente: string;
  Nombre_Completo: string;
  Cedula: string;
  direccion: string;
  telefono: string;
  ingreso_mensual: number;
  tipo_cliente: ClientType;
  usuario: string;
  password: string;
  cuentas: Cuenta[];
  tarjetas: {
    credito: TarjetaCredito[];
    debito: TarjetaDebito[];
  };
  prestamos?: Prestamo[];
}

interface AuthContextType {
  cliente: Cliente | null;
  login: (cedula: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  cliente: null,
  login: async () => false,
  logout: () => {},
  updateAccountBalance: () => {}
});

export const useAuth = () => useContext(AuthContext);

const users = rawUsers as Cliente[];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  // Función de login asíncrona para simular llamada a API
  const login = useCallback(async (cedula: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const found = users.find(u => u.Cedula === cedula && u.password === password);
      if (found) {
        setCliente(found);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Función para actualizar saldos
  const updateAccountBalance = useCallback((accountId: string, newBalance: number) => {
    setCliente(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        cuentas: prev.cuentas.map(account => 
          account.id === accountId ? { ...account, saldo: newBalance } : account
        )
      };
    });
  }, []);

  const logout = useCallback(() => {
    setCliente(null);
  }, []);

  return (
    <AuthContext.Provider value={{ cliente, login, logout, updateAccountBalance }}>
      {children}
    </AuthContext.Provider>
  );
};