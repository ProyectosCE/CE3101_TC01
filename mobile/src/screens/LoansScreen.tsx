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
 * Component: LoansScreen
 * Pantalla para visualizar préstamos del cliente y realizar pagos normales o extraordinarios.
 *
 * Context:
 * - cliente: Objeto con la información del cliente autenticado.
 * - updateAccountBalance: Función para actualizar el saldo de una cuenta.
 * - saveTransaction: Función para registrar un movimiento en una cuenta.
 * - saveLoanPayment: Función para registrar un pago de préstamo.
 *
 * State:
 * - montoExtraordinario: string - Monto ingresado para pago extraordinario.
 * - cuentaSeleccionada: string | null - ID de la cuenta seleccionada para el pago.
 * - loading: boolean - Indica si hay una operación en curso.
 * - successMessage: string - Mensaje de éxito temporal.
 *
 * Example:
 * <LoansScreen />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Pago } from '../context/AuthContext';


interface Prestamo {
  id: string;
  monto: number;
  saldo_pendiente: number;
  tasa_interes: number;
  fecha_inicio: string;
  cuotas: PrestamoCuota[];
}

interface PrestamoCuota {
  numero: number;
  fecha: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
}

interface Cuenta {
  id: string;
  numero: string;
  tipo: string;
  saldo: number;
}

interface Movimiento {
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: string;
}
export default function LoansScreen() {
  const { 
    cliente, 
    updateAccountBalance, 
    saveTransaction,
    saveLoanPayment
  } = useAuth();

  const [montoExtraordinario, setMontoExtraordinario] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No autorizado</Text>
      </View>
    );
  }

  // Muestra un mensaje de éxito temporal
  const mostrarMensajeExito = (mensaje: string) => {
    setSuccessMessage(mensaje);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Maneja el pago normal de una cuota de préstamo.
   * @param prestamo Préstamo a pagar.
   * @param cuota Cuota a pagar.
   */
  const handlePagoNormal = async (prestamo: Prestamo, cuota: PrestamoCuota) => {
    try {
      setLoading(true);
      
      if (!cuentaSeleccionada) {
        Alert.alert('Error', 'Seleccione una cuenta para realizar el pago');
        return;
      }

      const cuenta = cliente.cuentas.find(c => c.id === cuentaSeleccionada);
      if (!cuenta || cuenta.saldo < cuota.monto) {
        Alert.alert('Error', 'Saldo insuficiente en la cuenta seleccionada');
        return;
      }

      console.log('[Pago] Enviando pago normal al backend...');
      
      const pago: Pago = {
        id_prestamo: prestamo.id,
        monto: cuota.monto,
        id_cuenta: cuenta.id,
        tipo_pago: "NORMAL"
      };

      const pagoExitoso = await saveLoanPayment(pago);

      if (!pagoExitoso) {
        throw new Error('Error al registrar el pago en el backend');
      }

      console.log('[Pago] Pago normal registrado exitosamente');

      // Actualizar estado local
      const movimiento: Movimiento = {
        fecha: new Date().toISOString(),
        descripcion: `Pago cuota ${cuota.numero} préstamo ${prestamo.id}`,
        monto: -cuota.monto,
        tipo: 'Pago de préstamo',
      };

      saveTransaction(cuenta.id, movimiento);
      updateAccountBalance(cuenta.id, cuenta.saldo - cuota.monto);

      mostrarMensajeExito(`Pago de cuota ${cuota.numero} realizado`);
    } catch (error) {
      console.error('Error en handlePagoNormal:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el pago extraordinario de un préstamo.
   * @param prestamo Préstamo a pagar.
   */
  const handlePagoExtraordinario = async (prestamo: Prestamo) => {
    try {
      setLoading(true);
      const monto = parseFloat(montoExtraordinario);

      if (isNaN(monto)) {
        Alert.alert('Error', 'Ingrese un monto válido');
        return;
      }

      if (monto <= 0) {
        Alert.alert('Error', 'El monto debe ser mayor a cero');
        return;
      }

      if (!cuentaSeleccionada) {
        Alert.alert('Error', 'Seleccione una cuenta para realizar el pago');
        return;
      }

      const cuenta = cliente.cuentas.find(c => c.id === cuentaSeleccionada);
      if (!cuenta || cuenta.saldo < monto) {
        Alert.alert('Error', 'Saldo insuficiente en la cuenta seleccionada');
        return;
      }

      console.log('[Pago] Enviando pago extraordinario al backend...');
      
      const pago: Pago = {
        id_prestamo: prestamo.id,
        monto: monto,
        id_cuenta: cuenta.id,
        tipo_pago: "EXTRAORDINARIO" 
      };

      const pagoExitoso = await saveLoanPayment(pago);

      if (!pagoExitoso) {
        throw new Error('Error al registrar el pago en el backend');
      }

      console.log('[Pago] Pago extraordinario registrado exitosamente');

      // Actualizar estado local
      const movimiento: Movimiento = {
        fecha: new Date().toISOString(),
        descripcion: `Pago extraordinario préstamo ${prestamo.id}`,
        monto: -monto,
        tipo: 'Pago de préstamo',
      };

      saveTransaction(cuenta.id, movimiento);
      updateAccountBalance(cuenta.id, cuenta.saldo - monto);
      setMontoExtraordinario('');

      mostrarMensajeExito('Pago extraordinario realizado');
    } catch (error) {
      console.error('Error en handlePagoExtraordinario:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };
  // Renderiza la información de un préstamo y sus cuotas
  const renderPrestamo = ({ item: prestamo }: { item: Prestamo }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Préstamo #{prestamo.id}</Text>
      <Text style={styles.text}>Saldo pendiente: ₡{prestamo.saldo_pendiente.toLocaleString()}</Text>
      <Text style={styles.text}>Tasa: {prestamo.tasa_interes}%</Text>
      <Text style={styles.subTitle}>Cuotas</Text>

      {prestamo.cuotas.map((cuota: PrestamoCuota) => (
        <View key={`${prestamo.id}-${cuota.numero}`} style={styles.cuotaBox}>
          <Text style={styles.cuotaText}>
            Cuota #{cuota.numero} - {cuota.estado} - ₡{cuota.monto.toLocaleString()}
          </Text>
          {cuota.estado === 'pendiente' && (
            <TouchableOpacity
              style={styles.btnMini}
              onPress={() => handlePagoNormal(prestamo, cuota)}
              disabled={loading}
            >
              <Text style={styles.btnText}>Pagar</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Monto extraordinario"
        value={montoExtraordinario}
        onChangeText={setMontoExtraordinario}
        keyboardType="numeric"
        editable={!loading}
      />
      <TouchableOpacity 
        style={[styles.btn, loading && styles.disabledBtn]} 
        onPress={() => handlePagoExtraordinario(prestamo)}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Procesando...' : 'Pago Extraordinario'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Préstamos</Text>

      <Text style={styles.sectionTitle}>Seleccione cuenta para el pago</Text>
      <FlatList
        data={cliente.cuentas}
        horizontal
        keyExtractor={(item: Cuenta) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.cuentaBox,
              item.id === cuentaSeleccionada && styles.cuentaSeleccionada,
            ]}
            onPress={() => !loading && setCuentaSeleccionada(item.id)}
            disabled={loading}
          >
            <Text style={styles.label}>{item.tipo} - {item.numero}</Text>
            <Text style={styles.text}>₡{item.saldo.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10264D" />
        </View>
      ) : (
        <FlatList
          data={cliente.prestamos || []}
          keyExtractor={(item: Prestamo) => item.id}
          renderItem={renderPrestamo}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}

      {successMessage && (
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <Text style={styles.successText}>✔ {successMessage}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF', padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#39446D',
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
  },
  cuentaBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2DCCD3',
    minWidth: 160,
    elevation: 2,
  },
  cuentaSeleccionada: {
    borderColor: '#10264D',
    borderWidth: 1.5,
  },
  label: { fontWeight: 'bold', color: '#10264D' },
  text: { fontSize: 14, color: '#555' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
  },
  subTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#39446D',
  },
  cuotaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cuotaText: { fontSize: 13, color: '#333' },
  btnMini: {
    backgroundColor: '#2DCCD3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#10264D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#7180AC',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 99,
  },
  successBox: {
    backgroundColor: '#2DCCD3',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  successText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
