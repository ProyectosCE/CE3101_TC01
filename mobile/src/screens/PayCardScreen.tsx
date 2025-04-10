import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PayCard'>;

export default function PayCardScreen({ route, navigation }: Props) {
  const {
    cliente,
    saveCreditCardMovement,
    updateAccountBalance,
  } = useAuth();
  const { cardId } = route.params;
  const [monto, setMonto] = useState('');

  const tarjeta = cliente?.tarjetas.credito.find((t) => t.id === cardId);
  const cuentaAsociada = tarjeta?.cuenta_asociada
    ? cliente?.cuentas.find((c) => c.id === tarjeta.cuenta_asociada)
    : null;

  if (!tarjeta) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tarjeta no encontrada</Text>
      </View>
    );
  }

  const handlePago = () => {
    const valor = parseFloat(monto);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Error', 'Ingrese un monto válido');
      return;
    }

    if (valor > tarjeta.saldo) {
      Alert.alert('Error', 'El monto excede la deuda actual de la tarjeta');
      return;
    }

    if (!cuentaAsociada) {
      Alert.alert('Error', 'No se encontró la cuenta asociada');
      return;
    }

    if (cuentaAsociada.saldo < valor) {
      Alert.alert('Error', 'Fondos insuficientes en la cuenta asociada');
      return;
    }

    const fecha = new Date().toISOString().split('T')[0];

    // Movimiento negativo en la cuenta asociada
    const movimientoCuenta = {
      fecha,
      descripcion: `Pago tarjeta ****${tarjeta.numero.slice(-4)}`,
      monto: -valor,
      tipo: 'pago',
    };

    // Movimiento positivo (reducción de deuda) en tarjeta
    const movimientoTarjeta = {
      fecha,
      descripcion: `Pago desde cuenta ${cuentaAsociada.numero}`,
      monto: -valor,
      tipo: 'pago',
    };

    // Registrar en tarjeta y cuenta
    saveCreditCardMovement(tarjeta.id, movimientoTarjeta, cuentaAsociada.id);

    // Reducir saldo en cuenta asociada
    updateAccountBalance(cuentaAsociada.id, cuentaAsociada.saldo - valor);

    Alert.alert('Pago exitoso', `Se ha pagado ₡${valor.toLocaleString()}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagar Tarjeta</Text>

      <Text style={styles.label}>Número: **** **** **** {tarjeta.numero.slice(-4)}</Text>
      <Text style={styles.label}>Saldo usado: ₡{tarjeta.saldo.toLocaleString()}</Text>
      <Text style={styles.label}>Límite: ₡{tarjeta.limite.toLocaleString()}</Text>

      {cuentaAsociada && (
        <Text style={styles.label}>
          Cuenta asociada: {cuentaAsociada.numero} (Disponible: ₡{cuentaAsociada.saldo.toLocaleString()})
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Monto a pagar"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <Button title="Confirmar Pago" color="#1B396A" onPress={handlePago} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#7180AC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
});
