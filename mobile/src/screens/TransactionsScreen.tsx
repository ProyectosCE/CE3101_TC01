/**
 * @file TransactionsScreen.tsx
 * @description Pantalla para realizar transferencias tipo IBAN o SINPE móvil.
 * Permite seleccionar una cuenta de origen, ingresar destino, monto, motivo y realizar la operación.
 * Se registran los movimientos en las cuentas y tarjetas asociadas.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;
type TransferType = 'IBAN' | 'SINPE';

/**
 * Pantalla que gestiona las transferencias entre cuentas.
 * @param navigation Navegación de React Navigation
 */
export default function TransactionsScreen({ navigation }: Props) {
  const {
    cliente,
    updateAccountBalance,
    saveTransaction,
    saveDebitCardMovement,
    saveCreditCardMovement,
  } = useAuth();

  const [transferType, setTransferType] = useState<TransferType | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [ibanDestino, setIbanDestino] = useState('');
  const [telefonoDestino, setTelefonoDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usuario no autorizado</Text>
      </View>
    );
  }

  const cuentasOrigen = cliente.cuentas;

  /**
   * Ejecuta una transferencia validando los campos requeridos.
   * Registra movimientos en cuenta origen y destino, así como tarjetas asociadas.
   */
  const handleTransfer = async () => {
    const montoNum = parseFloat(monto);
    const fecha = new Date().toISOString().split('T')[0];
    const motivoTrim = motivo.trim();
    const isIBAN = transferType === 'IBAN';
    const destino = isIBAN ? ibanDestino.trim().toUpperCase() : telefonoDestino.trim();

    // Validación de campos
    if (!transferType || !selectedAccountId || !destino || !monto.trim() || !motivoTrim) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (isIBAN && destino.length > 22) {
      Alert.alert('Error', 'El IBAN no debe superar los 22 caracteres');
      return;
    }

    if (!isIBAN && !/^\d{4}-\d{4}$/.test(destino)) {
      Alert.alert('Error', 'Teléfono inválido. Formato: 8888-0000');
      return;
    }

    if (motivoTrim.length > 20) {
      Alert.alert('Error', 'El motivo no debe superar los 20 caracteres');
      return;
    }

    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert('Error', 'Monto inválido');
      return;
    }

    const cuentaOrigen = cliente.cuentas.find((c) => c.id === selectedAccountId);
    if (!cuentaOrigen || cuentaOrigen.saldo < montoNum) {
      Alert.alert('Error', 'Saldo insuficiente o cuenta inválida');
      return;
    }

    // Buscar cuenta destino
    const allUsers = require('../data/users.json');
    let cuentaDestino: any = null;

    for (const user of allUsers) {
      for (const cuenta of user.cuentas) {
        const match = isIBAN
          ? cuenta.iban?.trim().toUpperCase() === destino
          : user.telefono === destino;
        if (match) {
          cuentaDestino = cuenta;
          break;
        }
      }
      if (cuentaDestino) break;
    }

    if (!cuentaDestino) {
      Alert.alert('Error', 'Cuenta destino no encontrada');
      return;
    }

    const movimientoOrigen = {
      fecha,
      descripcion: `${isIBAN ? 'Transferencia' : 'SINPE Móvil'} a ${cuentaDestino.numero}`,
      monto: -montoNum,
      tipo: motivoTrim,
    };

    const movimientoDestino = {
      fecha,
      descripcion: `${isIBAN ? 'Transferencia' : 'SINPE Móvil'} recibida de ${cuentaOrigen.numero}`,
      monto: montoNum,
      tipo: motivoTrim,
    };

    // Simulación de espera de transacción
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    // Actualización de saldos y movimientos
    cuentaOrigen.saldo -= montoNum;
    cuentaDestino.saldo += montoNum;

    updateAccountBalance(cuentaOrigen.id, cuentaOrigen.saldo);
    saveTransaction(cuentaOrigen.id, movimientoOrigen);

    // Registrar movimientos en tarjetas asociadas si existen
    const tarjetaDebitoOrigen = cliente.tarjetas.debito.find(
      (t) => t.cuenta_asociada === cuentaOrigen.id
    );
    if (tarjetaDebitoOrigen) {
      saveDebitCardMovement(tarjetaDebitoOrigen.id, movimientoOrigen, cuentaOrigen.id);
    }

    const tarjetaCreditoOrigen = cliente.tarjetas.credito.find(
      (t) => t.cuenta_asociada === cuentaOrigen.id
    );
    if (tarjetaCreditoOrigen) {
      saveCreditCardMovement(tarjetaCreditoOrigen.id, movimientoOrigen, cuentaOrigen.id);
    }

    for (const user of allUsers) {
      const tarjetaDebitoDestino = user.tarjetas?.debito?.find(
        (t: any) => t.cuenta_asociada === cuentaDestino.id
      );
      if (tarjetaDebitoDestino) {
        saveDebitCardMovement(tarjetaDebitoDestino.id, movimientoDestino, cuentaDestino.id);
        break;
      }

      const tarjetaCreditoDestino = user.tarjetas?.credito?.find(
        (t: any) => t.cuenta_asociada === cuentaDestino.id
      );
      if (tarjetaCreditoDestino) {
        saveCreditCardMovement(tarjetaCreditoDestino.id, movimientoDestino, cuentaDestino.id);
        break;
      }
    }

    setLoading(false);
    Alert.alert('Éxito', 'Transferencia realizada correctamente');
    navigation.goBack();
  };

  /**
   * Renderiza visualmente una cuenta de origen.
   */
  const renderCuenta = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.cuentaBox, item.id === selectedAccountId && styles.cuentaSeleccionada]}
      onPress={() => setSelectedAccountId(item.id)}
    >
      <Text style={styles.cuentaLabel}>{item.tipo} - {item.numero}</Text>
      <Text style={styles.cuentaSaldo}>₡{item.saldo.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  // Vista principal
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Transferencia</Text>

      <Text style={styles.sectionTitle}>Tipo de Transferencia</Text>
      <View style={styles.tipoBox}>
        <TouchableOpacity
          style={[styles.tipoBtn, transferType === 'IBAN' && styles.tipoActivo]}
          onPress={() => setTransferType('IBAN')}
        >
          <Text style={styles.tipoText}>IBAN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipoBtn, transferType === 'SINPE' && styles.tipoActivo]}
          onPress={() => setTransferType('SINPE')}
        >
          <Text style={styles.tipoText}>SINPE Móvil</Text>
        </TouchableOpacity>
      </View>

      {transferType && (
        <>
          <Text style={styles.sectionTitle}>Seleccione cuenta de origen</Text>
          <FlatList
            data={cuentasOrigen}
            renderItem={renderCuenta}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          {transferType === 'IBAN' ? (
            <>
              <Text style={styles.sectionTitle}>IBAN destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese el IBAN"
                value={ibanDestino}
                onChangeText={setIbanDestino}
                maxLength={22}
                autoCapitalize="characters"
              />
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Teléfono destino</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 8888-0000"
                value={telefonoDestino}
                onChangeText={setTelefonoDestino}
                keyboardType="numeric"
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Monto</Text>
          <TextInput
            style={styles.input}
            placeholder="₡"
            value={monto}
            onChangeText={setMonto}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Motivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo (máx 20 caracteres)"
            value={motivo}
            onChangeText={setMotivo}
            maxLength={20}
          />

          <TouchableOpacity style={styles.btn} onPress={handleTransfer} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Transferir</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF', padding: 20 },
  title: {
    fontSize: 22,
    color: '#10264D',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#39446D',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  tipoBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E5E8F0',
  },
  tipoActivo: {
    backgroundColor: '#10264D',
  },
  tipoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cuentaBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2DCCD3',
    minWidth: 150,
    elevation: 2,
  },
  cuentaSeleccionada: {
    borderColor: '#10264D',
    borderWidth: 1.5,
  },
  cuentaLabel: {
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 4,
  },
  cuentaSaldo: {
    fontSize: 16,
    color: '#444',
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#10264D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
