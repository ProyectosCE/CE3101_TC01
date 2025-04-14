import React, { createContext, useContext, useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import rawUsers from '../data/users.json';

// Types
type Currency = 'Dolares' | 'Colones' | 'Euros';
type AccountType = 'Credito' | 'Debito';
type ClientType = 'Fisico' | 'Juridico';

interface Movimiento {
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: string;
}

interface Cuenta {
  id: string;
  currency: Currency;
  tipo: AccountType;
  numero: string;
  saldo: number;
  iban?: string;
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
  movimientos?: Movimiento[];
}

interface TarjetaDebito {
  id: string;
  numero: string;
  tipo: 'Debito';
  cuenta_asociada: string;
  saldo: number;
  movimientos?: Movimiento[];
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

const defaultUsers = rawUsers as Cliente[];
const USERS_FILE_PATH = FileSystem.documentDirectory + 'users.json';
const BACKEND_URL = 'http://192.168.100.100:5020/api/clientes';
const CUENTAS_URL = 'http://192.168.100.100:5020/api/cuenta';
const mapCurrency = (id_moneda: number): Currency =>
  id_moneda === 1 ? 'Colones' : id_moneda === 2 ? 'Dolares' : 'Euros';

const mapAccountType = (id_tipo: number): AccountType =>
  id_tipo === 1 ? 'Debito' : 'Credito';

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
    cuentas: [], // se llena luego
    tarjetas: {
      credito: user.tarjetas?.credito || [],
      debito: user.tarjetas?.debito || []
    },
    prestamos: user.prestamos || []
  }));
};

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

const fetchCuentasParaCliente = async (idCliente: string): Promise<Cuenta[]> => {
  try {
    const url = CUENTAS_URL; // ya no usamos el parámetro en la URL
    console.log('Llamando a:', url);
    const response = await fetch(url);
    const json = await response.json();

    console.log('Respuesta de /api/cuenta:', json);

    if (response.ok && Array.isArray(json)) {
      const cuentasFiltradas = json.filter((cuenta: any) => cuenta.id_cliente?.toString() === idCliente);

      return cuentasFiltradas.map((cuenta: any, index: number) => ({
        id: cuenta.numero_cuenta?.toString() || index.toString(),
        currency: mapCurrency(cuenta.id_moneda),
        tipo: mapAccountType(cuenta.id_tipo_cuenta),
        numero: cuenta.numero_cuenta?.toString() || '',
        saldo: cuenta.monto || 0,
        movimientos: cuenta.movimientos || [],
      }));
    } else {
      console.warn('Respuesta inesperada en /api/cuenta:', json);
    }
  } catch (err) {
    console.error('Error al cargar cuentas desde backend:', err);
  }

  return [];
};

const PRESTAMOS_URL = 'http://192.168.100.100:5020/api/prestamo';

const fetchPrestamosParaCliente = async (idCliente: string): Promise<Prestamo[]> => {
  try {
    const response = await fetch(`${PRESTAMOS_URL}/consultarPrestamos/${idCliente}`);
    const json = await response.json();

    if (response.ok && Array.isArray(json)) {
      return json.map((prestamo: any, index: number) => ({
        id: prestamo.id_prestamo?.toString() || index.toString(),
        monto: prestamo.monto_original,
        saldo_pendiente: prestamo.saldo,
        tasa_interes: prestamo.tasa_interes,
        fecha_inicio: prestamo.fecha_inicio,
        cuotas: prestamo.cuotas || [],
      }));
    } else {
      console.warn('Respuesta inesperada en /consultarPrestamos:', json);
    }
  } catch (err) {
    console.error('Error al cargar préstamos desde backend:', err);
  }

  return [];
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const login = useCallback(async (cedula: string, password: string): Promise<boolean> => {
    try {
      let users: Cliente[] = [];

      try {
        const response = await fetch(BACKEND_URL);
        if (response.ok) {
          const backendData = await response.json();
          users = transformBackendData(backendData);
          await FileSystem.writeAsStringAsync(USERS_FILE_PATH, JSON.stringify(backendData));
        } else {
          users = await loadLocalUsers();
        }
      } catch (backendError) {
        users = await loadLocalUsers();
      }

      const found = users.find(u => u.Cedula === cedula && u.password === password);

      if (found) {
        const cuentas = await fetchCuentasParaCliente(found.id_cliente);
        const prestamos = await fetchPrestamosParaCliente(found.id_cliente);
        const clienteConCuentasYPrestamos = { ...found, cuentas, prestamos };
        setCliente(clienteConCuentasYPrestamos);
        
        return true;
      }

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
