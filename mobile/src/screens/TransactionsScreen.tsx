import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function TransactionsScreen() {
  const { cliente, updateAccountBalance } = useAuth();

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [destino, setDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');

  const cuentas = cliente?.cuentas || [];

  const realizarTransferencia = () => {
    const cuentaOrigen = cuentas.find((c) => c.id === selectedAccountId);
    if (!cuentaOrigen) {
      Alert.alert('Error', 'Debe seleccionar una cuenta de origen');
      return;
    }

    if (!destino.trim() || !monto.trim() || !motivo.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const cuentaDestino = cliente?.cuentas.find((c) => c.numero === destino) ||
      null; // Permitir destino externo

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido y mayor a 0');
      return;
    }

    if (cuentaOrigen.saldo < montoNum) {
      Alert.alert('Error', 'Fondos insuficientes en la cuenta de origen');
      return;
    }

    // Actualizar saldos y movimientos
    cuentaOrigen.saldo -= montoNum;
    cuentaOrigen.movimientos = [
      ...(cuentaOrigen.movimientos || []),
      {
        fecha: new Date().toISOString().split('T')[0],
        descripcion: motivo,
        monto: -montoNum,
        tipo: motivo,
      },
    ];

    if (cuentaDestino) {
      cuentaDestino.saldo += montoNum;
      cuentaDestino.movimientos = [
        ...(cuentaDestino.movimientos || []),
        {
          fecha: new Date().toISOString().split('T')[0],
          descripcion: motivo,
          monto: montoNum,
          tipo: motivo,
        },
      ];
    }

    updateAccountBalance(cuentaOrigen.id, cuentaOrigen.saldo);
    if (cuentaDestino) updateAccountBalance(cuentaDestino.id, cuentaDestino.saldo);

    Alert.alert('Éxito', 'Transferencia realizada correctamente');
    setDestino('');
    setMonto('');
    setMotivo('');
  };

  const renderCuenta = (cuenta: any) => {
    const seleccionada = selectedAccountId === cuenta.id;
    return (
      <TouchableOpacity
        style={[
          styles.accountCard,
          seleccionada && styles.accountCardSelected,
        ]}
        onPress={() => setSelectedAccountId(cuenta.id)}
      >
        <Text style={styles.accountText}>
          {cuenta.tipo} ****{cuenta.numero.slice(-4)}
        </Text>
        <Text style={styles.accountBalance}>₡{cuenta.saldo.toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Realizar Transferencia</Text>

      <Text style={styles.label}>Seleccione cuenta de origen:</Text>
      <FlatList
        data={cuentas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderCuenta(item)}
        horizontal
        contentContainerStyle={styles.accountsList}
      />

      <Text style={styles.label}>Número de cuenta destino</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 222233334444"
        value={destino}
        onChangeText={setDestino}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Monto a transferir</Text>
      <TextInput
        style={styles.input}
        placeholder="₡"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Motivo de la transferencia</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Pago de colegiatura"
        value={motivo}
        onChangeText={setMotivo}
      />

      <TouchableOpacity style={styles.button} onPress={realizarTransferencia}>
        <Text style={styles.buttonText}>TRANSFERIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#39446D',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 10,
  },
  accountsList: {
    gap: 10,
    marginBottom: 10,
  },
  accountCard: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2DCCD3',
    marginRight: 10,
    height: 80, // más compacto verticalmente
    justifyContent: 'center',
    width: 160,
  },
  accountCardSelected: {
    borderColor: '#10264D',
    borderWidth: 2,
  },
  accountText: {
    fontSize: 16,
    color: '#10264D',
    fontWeight: 'bold',
  },
  accountBalance: {
    fontSize: 14,
    color: '#39446D',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#10264D',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
