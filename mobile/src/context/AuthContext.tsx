import React, { createContext, useContext, useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
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

const AuthContext = createContext<AuthContextType>({
  cliente: null,
  login: async () => false,
  logout: () => {},
  updateAccountBalance: () => {},
  saveTransaction: () => {},
  saveCreditCardMovement: () => {},
  saveDebitCardMovement: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Carga inicial de usuarios desde el archivo JSON incluido en el bundle.
const defaultUsers = rawUsers as Cliente[];

// Ruta para guardar el archivo actualizado de usuarios en el filesystem.
const USERS_FILE_PATH = FileSystem.documentDirectory + 'users.json';

// URL del backend para obtener los datos actualizados de clientes.
const BACKEND_URL = 'http://192.168.100.100:5020/api/clientes';

/**
 * Transforma los datos del backend al formato de la interfaz Cliente
 */
const transformBackendData = (backendData: any[]): Cliente[] => {
  return backendData.map(user => ({
    id_cliente: user.id_cliente?.toString() || '',
    Nombre_Completo: user.nombreCompleto || `${user.nombre} ${user.apellido1} ${user.apellido2 || ''}`.trim(),
    Cedula: user.cedula || '',
    direccion: user.direccion || '',
    telefono: user.telefono || '',
    ingreso_mensual: user.ingreso_mensual || 0,
    tipo_cliente: (user.tipo_id === 'FISICO' ? 'Fisico' : 'Juridico') as ClientType,
    usuario: user.usuario || '',
    password: user.password || '',
    cuentas: user.cuentas || [],
    tarjetas: {
      credito: user.tarjetas?.credito || [],
      debito: user.tarjetas?.debito || []
    },
    prestamos: user.prestamos || []
  }));
};

/**
 * Carga usuarios desde el archivo local o devuelve los por defecto
 */
const loadLocalUsers = async (): Promise<Cliente[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(USERS_FILE_PATH);
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(USERS_FILE_PATH);
      const localUsers = JSON.parse(fileContent);
      return transformBackendData(localUsers);
    }
  } catch (error) {
    console.warn('Error al leer archivo local:', error);
  }
  return defaultUsers;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const login = useCallback(async (cedula: string, password: string): Promise<boolean> => {
    try {
      let users: Cliente[] = [];
      
      // Intentar obtener datos del backend
      try {
        console.log('Intentando conectar al backend...');
        const response = await fetch(BACKEND_URL);
        console.log('Respuesta del backend recibida. Status:', response.status);
        
        if (response.ok) {
          const backendData = await response.json();
          console.log('Datos crudos del backend:', backendData);
          
          users = transformBackendData(backendData);
          console.log('Datos transformados:', users);
          
          await FileSystem.writeAsStringAsync(USERS_FILE_PATH, JSON.stringify(backendData));
          console.log('Datos guardados en archivo local');
        } else {
          console.warn('El backend respondió con error. Usando datos locales...');
          users = await loadLocalUsers();
        }
      } catch (backendError) {
        console.error('Error al conectar al backend:', backendError);
        users = await loadLocalUsers();
      }

      console.log('Usuarios disponibles para login:', users.map(u => ({
        cedula: u.Cedula,
        nombre: u.Nombre_Completo
      })));
      
      // Buscar usuario (usando los campos transformados)
      const found = users.find(u => u.Cedula === cedula && u.password === password);
      
      if (found) {
        console.log('Usuario encontrado:', found.Nombre_Completo);
        setCliente(found);
        return true;
      }
      
      console.log('Usuario no encontrado. Credenciales proporcionadas:', { cedula, password });
      return false;
    } catch (error) {
      console.error('Error crítico durante login:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => setCliente(null), []);

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

  const saveTransaction = useCallback((accountId: string, movimiento: Movimiento) => {
    setCliente(prev => {
      if (!prev) return null;
      return {
        ...prev,
        cuentas: prev.cuentas.map(account =>
          account.id === accountId
            ? { ...account, movimientos: [...(account.movimientos || []), movimiento] }
            : account
        ),
      };
    });
  }, []);

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
            ? { ...cuenta, movimientos: [...(cuenta.movimientos || []), movimiento] }
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
