import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PayCard'>;

export default function PayCardScreen({ route, navigation }: Props) {
  const { cliente, updateAccountBalance } = useAuth();
  const { cardId } = route.params;
  const [monto, setMonto] = useState('');

  const tarjeta = cliente?.tarjetas.credito.find((t) => t.id === cardId);

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
      Alert.alert('Error', 'El monto excede la deuda actual');
      return;
    }

    tarjeta.saldo -= valor;

    Alert.alert('Pago exitoso', `Se ha pagado ₡${valor.toLocaleString()}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagar Tarjeta</Text>

      <Text style={styles.label}>Número: **** **** **** {tarjeta.numero.slice(-4)}</Text>
      <Text style={styles.label}>Saldo actual: ₡{tarjeta.saldo.toLocaleString()}</Text>
      <Text style={styles.label}>Límite: ₡{tarjeta.limite.toLocaleString()}</Text>

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
