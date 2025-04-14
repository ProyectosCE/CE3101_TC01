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
    const response = await fetch(`http://192.168.100.100:5020/api/Prestamo/consultarPrestamos/${idCliente}`);
    if (response.ok) {
      const json = await response.json();

      return json.map((prestamo: any) => ({
        id: prestamo.id_prestamo?.toString() || '',
        monto: prestamo.monto_original,
        saldo_pendiente: prestamo.saldo,
        tasa_interes: prestamo.tasa_interes,
        fecha_inicio: prestamo.fecha_inicio,
        cuotas: prestamo.cuotas || [],
      }));
    } else {
      console.warn('No se pudieron obtener los préstamos:', response.statusText);
    }
  } catch (error) {
    console.error('Error al obtener préstamos del backend:', error);
  }

  return [];
};

const TARJETAS_URL = 'http://192.168.100.100:5020/api/Tarjeta';

const fetchTarjetasParaCliente = async (cuentasCliente: Cuenta[]): Promise<{
  credito: TarjetaCredito[],
  debito: TarjetaDebito[]
}> => {
  try {
    console.log('[Tarjetas] Iniciando fetch...');
    const response = await fetch(TARJETAS_URL);
    const tarjetasBackend = await response.json();
    console.log('[Tarjetas] Respuesta backend:', tarjetasBackend);

    // 1. Obtener números de cuenta del cliente (como strings)
    const numerosCuenta = cuentasCliente.map(c => c.numero.toString());
    console.log('[Tarjetas] Cuentas cliente:', numerosCuenta);

    // 2. Filtrar y mapear tarjetas
    const resultado = tarjetasBackend.reduce((acc: any, tarjeta: any) => {
      // Verificar si el número de tarjeta coincide con alguna cuenta
      const cuentaAsociada = tarjeta.numero_tarjeta?.toString();
      const tieneCuentaValida = numerosCuenta.includes(cuentaAsociada);

      if (!tieneCuentaValida) {
        console.log(`[Tarjetas] Tarjeta ${cuentaAsociada} no coincide con cuentas cliente`);
        return acc;
      }

      console.log(`[Tarjetas] Procesando tarjeta ${cuentaAsociada}`);
      
      const baseCard = {
        id: tarjeta.id?.toString() || Date.now().toString(),
        numero: cuentaAsociada,
        saldo: tarjeta.monto_disponible || tarjeta.saldo_actual || 0,
        cuenta_asociada: cuentaAsociada,
        movimientos: []
      };

      // Tipo DEBITO/CREDITO (convertir string a número)
      if (tarjeta.id_tipo_tarjeta === 'CREDITO') {
        acc.credito.push({
          ...baseCard,
          tipo: 'Credito',
          limite: tarjeta.monto_credito || 0,
          fecha_vencimiento: tarjeta.fecha_vencimiento,
          codigo_seguridad: tarjeta.cvc?.toString() || '000'
        });
      } else {
        acc.debito.push({
          ...baseCard,
          tipo: 'Debito'
        });
      }

      return acc;
    }, { credito: [], debito: [] });

    console.log('[Tarjetas] Resultado final:', resultado);
    return resultado;

  } catch (error) {
    console.error('[Tarjetas] Error:', error);
    return { credito: [], debito: [] };
  }
};

const fetchMovimientosParaCuenta = async (numeroCuenta: string): Promise<Movimiento[]> => {
  try {
    const response = await fetch(`http://192.168.100.100:5020/api/Transaccion/movimientos/${parseInt(numeroCuenta)}`);
    
    if (!response.ok) {
      console.warn('Error obteniendo movimientos para cuenta:', numeroCuenta, response.status);
      return [];
    }

    const transacciones = await response.json();
    
    return transacciones.map((transaccion: any) => ({
      fecha: transaccion.fecha,
      descripcion: transaccion.id_tipo_transaccion, // Ajustar según datos reales
      monto: transaccion.monto,
      tipo: transaccion.id_tipo_transaccion,
    }));

  } catch (error) {
    console.error('Error fetching movimientos:', error);
    return [];
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const login = useCallback(async (cedula: string, password: string): Promise<boolean> => {
    console.log('[AuthProvider] Iniciando proceso de login para cédula:', cedula);

    try {
      // 1. Obtener datos de usuarios
      let users: Cliente[] = [];
      try {
        console.log('[AuthProvider] Intentando obtener usuarios del backend...');
        const response = await fetch(BACKEND_URL);

        if (response.ok) {
          const backendData = await response.json();
          console.log('[AuthProvider] Datos crudos del backend:', backendData);
          users = transformBackendData(backendData);

          try {
            await FileSystem.writeAsStringAsync(USERS_FILE_PATH, JSON.stringify(backendData));
            console.log('[AuthProvider] Datos guardados localmente');
          } catch (fileError) {
            console.warn('[AuthProvider] Error al guardar datos locales:', fileError);
          }
        } else {
          console.warn('[AuthProvider] Falló respuesta del backend, usando datos locales');
          users = await loadLocalUsers();
        }
      } catch (backendError) {
        console.error('[AuthProvider] Error al conectar con backend:', backendError);
        users = await loadLocalUsers();
      }

      // 2. Buscar usuario
      console.log('[AuthProvider] Buscando usuario...');
      const found = users.find(u => u.Cedula === cedula && u.password === password);

      if (found) {
        console.log('[AuthProvider] Usuario encontrado, ID:', found.id_cliente);

        // 3. Obtener cuentas y préstamos en paralelo
        console.log('[AuthProvider] Obteniendo cuentas y préstamos...');
        const [cuentas, prestamos] = await Promise.all([
          fetchCuentasParaCliente(found.id_cliente),
          fetchPrestamosParaCliente(found.id_cliente)
        ]);

        console.log('[AuthProvider] Cuentas obtenidas:', cuentas.length);
        console.log('[AuthProvider] Préstamos obtenidos:', prestamos?.length || 0);

        // 4. Obtener movimientos para cada cuenta
        console.log('[AuthProvider] Obteniendo movimientos para cada cuenta...');
        const cuentasConMovimientos = await Promise.all(
          cuentas.map(async (cuenta) => ({
            ...cuenta,
            movimientos: await fetchMovimientosParaCuenta(cuenta.numero)
          }))
        );

        // 5. Obtener tarjetas basadas en cuentas
        console.log('[AuthProvider] Obteniendo tarjetas...');
        const tarjetas = await fetchTarjetasParaCliente(cuentasConMovimientos);
        console.log('[AuthProvider] Tarjetas obtenidas - Crédito:', tarjetas.credito.length, 'Débito:', tarjetas.debito.length);

        // 6. Construir objeto cliente completo
        const clienteCompleto: Cliente = {
          ...found,
          cuentas: cuentasConMovimientos,
          prestamos: prestamos || [],
          tarjetas: {
            credito: tarjetas.credito,
            debito: tarjetas.debito
          }
        };

        console.log('[AuthProvider] Cliente completo construido:', clienteCompleto);
        setCliente(clienteCompleto);
        return true;
      }

      console.warn('[AuthProvider] Usuario no encontrado o credenciales incorrectas');
      return false;
    } catch (error) {
      console.error('[AuthProvider] Error crítico durante login:', error);
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

        const cuentasActualizadas = cuentaAsociadaId 
          ? prev.cuentas.map(cuenta => {
              if (cuenta.id === cuentaAsociadaId) {
                const nuevoSaldo = cuenta.saldo + movimiento.monto;
                return {
                  ...cuenta,
                  saldo: nuevoSaldo,
                  movimientos: [...(cuenta.movimientos || []), movimiento],
                };
              }
              return cuenta;
            })
          : prev.cuentas;

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
            ? { 
                ...cuenta, 
                movimientos: [...(cuenta.movimientos || []), movimiento],
                saldo: cuenta.saldo + movimiento.monto
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
        logout: () => setCliente(null),
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
