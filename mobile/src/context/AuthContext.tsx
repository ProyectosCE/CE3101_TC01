import React, { createContext, useContext, useState, useCallback } from 'react';
import rawUsers from '../data/users.json';

/**
 * Enum de tipos de moneda.
 */
type Currency = 'Dolares' | 'Colones' | 'Euros';

/**
 * Enum de tipos de cuenta.
 */
type AccountType = 'Credito' | 'Debito';

/**
 * Enum de tipos de cliente.
 */
type ClientType = 'Fisico' | 'Juridico';

/**
 * Estructura que representa un movimiento financiero.
 */
interface Movimiento {
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: string;
}

/**
 * Estructura que representa una cuenta bancaria.
 */
interface Cuenta {
  id: string;
  currency: Currency;
  tipo: AccountType;
  numero: string;
  saldo: number;
  iban?: string;
  movimientos?: Movimiento[];
}

/**
 * Estructura que representa una tarjeta de crédito.
 */
interface TarjetaCredito {
  id: string;
  numero: string;
  tipo: 'Credito';
  limite: number;
  saldo: number;
  fecha_vencimiento: string;
  codigo_seguridad: string;
  cuenta_asociada?: string;
  movimientos?: Movimiento[];
}

/**
 * Estructura que representa una tarjeta de débito.
 */
interface TarjetaDebito {
  id: string;
  numero: string;
  tipo: 'Debito';
  cuenta_asociada: string;
  saldo: number;
  movimientos?: Movimiento[];
}

/**
 * Estructura que representa una cuota de préstamo.
 */
interface PrestamoCuota {
  numero: number;
  fecha: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

/**
 * Estructura que representa un préstamo.
 */
interface Prestamo {
  id: string;
  monto: number;
  saldo_pendiente: number;
  tasa_interes: number;
  fecha_inicio: string;
  cuotas: PrestamoCuota[];
}

/**
 * Estructura que representa a un cliente autenticado.
 */
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

/**
 * Interface para el contexto de autenticación.
 */
interface AuthContextType {
  cliente: Cliente | null;
  login: (cedula: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  saveTransaction: (accountId: string, movimiento: Movimiento) => void;
  saveCreditCardMovement: (cardId: string, movimiento: Movimiento, cuentaAsociadaId?: string) => void;
  saveDebitCardMovement: (cardId: string, movimiento: Movimiento, cuentaAsociadaId: string) => void;
}

/**
 * Contexto de autenticación de la app.
 */
const AuthContext = createContext<AuthContextType>({
  cliente: null,
  login: async () => false,
  logout: () => {},
  updateAccountBalance: () => {},
  saveTransaction: () => {},
  saveCreditCardMovement: () => {},
  saveDebitCardMovement: () => {},
});

/**
 * Hook para acceder al contexto de autenticación.
 *
 * @returns El contexto de autenticación.
 */
export const useAuth = () => useContext(AuthContext);

// Carga inicial de usuarios desde el archivo JSON.
const users = rawUsers as Cliente[];

/**
 * Proveedor de contexto para autenticación y gestión de datos del cliente.
 *
 * @param children Componentes hijos.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  /**
   * Realiza el inicio de sesión del cliente por cédula y contraseña.
   *
   * @param cedula Cédula del cliente.
   * @param password Contraseña del cliente.
   * @returns true si las credenciales son válidas.
   */
  const login = useCallback(async (cedula: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const found = users.find(u => u.Cedula === cedula && u.password === password);
    if (found) {
      setCliente(found);
      return true;
    }
    return false;
  }, []);

  /**
   * Cierra la sesión del cliente actual.
   */
  const logout = useCallback(() => setCliente(null), []);

  /**
   * Actualiza el saldo de una cuenta específica del cliente.
   *
   * @param accountId ID de la cuenta.
   * @param newBalance Nuevo saldo.
   */
  const updateAccountBalance = useCallback((accountId: string, newBalance: number) => {
    setCliente(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cuentas: prev.cuentas.map(account =>
          account.id === accountId ? { ...account, saldo: newBalance } : account
        ),
      };
    });
  }, []);

  /**
   * Guarda un movimiento en una cuenta específica.
   *
   * @param accountId ID de la cuenta.
   * @param movimiento Detalles del movimiento.
   */
  const saveTransaction = useCallback((accountId: string, movimiento: Movimiento) => {
    setCliente(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cuentas: prev.cuentas.map(account =>
          account.id === accountId
            ? {
                ...account,
                movimientos: [...(account.movimientos || []), movimiento],
              }
            : account
        ),
      };
    });
  }, []);

  /**
   * Guarda un movimiento en una tarjeta de crédito y actualiza la cuenta asociada.
   *
   * @param cardId ID de la tarjeta de crédito.
   * @param movimiento Movimiento a registrar.
   * @param cuentaAsociadaId ID de la cuenta vinculada.
   */
  const saveCreditCardMovement = useCallback(
    (cardId: string, movimiento: Movimiento, cuentaAsociadaId?: string) => {
      setCliente(prev => {
        if (!prev) return null;

        const tarjetasActualizadas = prev.tarjetas.credito.map(tarjeta =>
          tarjeta.id === cardId
            ? {
                ...tarjeta,
                movimientos: [...(tarjeta.movimientos || []), movimiento],
                saldo: tarjeta.saldo + movimiento.monto,
              }
            : tarjeta
        );

        const cuentasActualizadas = prev.cuentas.map(cuenta => {
          if (cuenta.id === cuentaAsociadaId) {
            const nuevoSaldo = cuenta.saldo + movimiento.monto;
            return {
              ...cuenta,
              saldo: nuevoSaldo,
              movimientos: [...(cuenta.movimientos || []), movimiento],
            };
          }
          return cuenta;
        });

        return {
          ...prev,
          tarjetas: { ...prev.tarjetas, credito: tarjetasActualizadas },
          cuentas: cuentasActualizadas,
        };
      });
    },
    []
  );

  /**
   * Guarda un movimiento en una tarjeta de débito y la cuenta vinculada.
   *
   * @param cardId ID de la tarjeta de débito.
   * @param movimiento Movimiento a registrar.
   * @param cuentaAsociadaId ID de la cuenta vinculada.
   */
  const saveDebitCardMovement = useCallback(
    (cardId: string, movimiento: Movimiento, cuentaAsociadaId: string) => {
      setCliente(prev => {
        if (!prev) return null;

        const tarjetasActualizadas = prev.tarjetas.debito.map(tarjeta =>
          tarjeta.id === cardId
            ? {
                ...tarjeta,
                movimientos: [...(tarjeta.movimientos || []), movimiento],
                saldo: tarjeta.saldo + movimiento.monto,
              }
            : tarjeta
        );

        const cuentasActualizadas = prev.cuentas.map(cuenta =>
          cuenta.id === cuentaAsociadaId
            ? {
                ...cuenta,
                movimientos: [...(cuenta.movimientos || []), movimiento],
              }
            : cuenta
        );

        return {
          ...prev,
          tarjetas: { ...prev.tarjetas, debito: tarjetasActualizadas },
          cuentas: cuentasActualizadas,
        };
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        cliente,
        login,
        logout,
        updateAccountBalance,
        saveTransaction,
        saveCreditCardMovement,
        saveDebitCardMovement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
