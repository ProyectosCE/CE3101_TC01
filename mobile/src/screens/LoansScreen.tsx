import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoansScreen() {
  const { cliente, updateAccountBalance, saveTransaction } = useAuth();
  const [montoExtraordinario, setMontoExtraordinario] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | null>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No autorizado</Text>
      </View>
    );
  }

  const mostrarMensajeExito = () => {
    setSuccessMessageVisible(true);
    setTimeout(() => setSuccessMessageVisible(false), 2000);
  };

  const handlePagoNormal = (prestamo: any, cuota: any) => {
    const cuenta = cliente.cuentas.find(c => c.id === cuentaSeleccionada);
    if (!cuenta || cuenta.saldo < cuota.monto) {
      Alert.alert('Error', 'Saldo insuficiente o cuenta no seleccionada');
      return;
    }

    cuenta.saldo -= cuota.monto;
    prestamo.saldo_pendiente -= cuota.monto;
    if (prestamo.saldo_pendiente < 0) prestamo.saldo_pendiente = 0;
    cuota.estado = 'pagado';

    updateAccountBalance(cuenta.id, cuenta.saldo);

    const movimiento = {
      fecha: new Date().toISOString().split('T')[0],
      descripcion: `Pago cuota préstamo ${prestamo.nombre || prestamo.id}`,
      monto: -cuota.monto,
      tipo: 'prestamo',
    };
    saveTransaction(cuenta.id, movimiento);

    Alert.alert('Éxito', 'Pago normal realizado');
    mostrarMensajeExito();
  };

  const handlePagoExtraordinario = (prestamo: any) => {
    const monto = parseFloat(montoExtraordinario);
    if (isNaN(monto) || monto <= 0) {
      Alert.alert('Error', 'Monto inválido');
      return;
    }

    const cuenta = cliente.cuentas.find(c => c.id === cuentaSeleccionada);
    if (!cuenta || cuenta.saldo < monto) {
      Alert.alert('Error', 'Saldo insuficiente o cuenta no seleccionada');
      return;
    }

    cuenta.saldo -= monto;
    prestamo.saldo_pendiente -= monto;
    if (prestamo.saldo_pendiente < 0) prestamo.saldo_pendiente = 0;

    updateAccountBalance(cuenta.id, cuenta.saldo);

    const movimiento = {
      fecha: new Date().toISOString().split('T')[0],
      descripcion: `Pago extraordinario préstamo ${prestamo.nombre || prestamo.id}`,
      monto: -monto,
      tipo: 'prestamo',
    };
    saveTransaction(cuenta.id, movimiento);
    setMontoExtraordinario('');
    Alert.alert('Éxito', 'Pago extraordinario realizado');
    mostrarMensajeExito();
  };

  const renderPrestamo = ({ item: prestamo }: any) => (
    <View style={styles.card}>
      <Text style={styles.label}>
        {prestamo.nombre ? prestamo.nombre : `Préstamo #${prestamo.id}`}
      </Text>
      <Text style={styles.text}>Saldo pendiente: ₡{prestamo.saldo_pendiente.toLocaleString()}</Text>
      <Text style={styles.text}>Tasa: {prestamo.tasa_interes}%</Text>
      <Text style={styles.subTitle}>Cuotas</Text>
      {prestamo.cuotas.map((cuota: any) => (
        <View key={cuota.numero} style={styles.cuotaBox}>
          <Text style={styles.cuotaText}>
            Cuota #{cuota.numero} - {cuota.estado} - ₡{cuota.monto.toLocaleString()}
          </Text>
          {cuota.estado === 'pendiente' && (
            <TouchableOpacity
              style={styles.btnMini}
              onPress={() => handlePagoNormal(prestamo, cuota)}
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
      />
      <TouchableOpacity style={styles.btn} onPress={() => handlePagoExtraordinario(prestamo)}>
        <Text style={styles.btnText}>Pago Extraordinario</Text>
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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.cuentaBox,
              item.id === cuentaSeleccionada && styles.cuentaSeleccionada,
            ]}
            onPress={() => setCuentaSeleccionada(item.id)}
          >
            <Text style={styles.label}>{item.tipo} - {item.numero}</Text>
            <Text style={styles.text}>₡{item.saldo.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={cliente.prestamos || []}
        keyExtractor={item => item.id}
        renderItem={renderPrestamo}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {successMessageVisible && (
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <Text style={styles.successText}>✔ Pago realizado correctamente</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF', padding: 20 },
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
