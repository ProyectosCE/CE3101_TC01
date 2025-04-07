import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export default function TransactionsScreen({ route }: Props) {
  const accountId = route?.params?.accountId;
  const { cliente } = useAuth();

  if (!accountId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No se recibió una cuenta válida.</Text>
      </View>
    );
  }

  const cuenta = cliente?.cuentas.find((c) => c.id === accountId);
  const transacciones = cuenta?.transacciones || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacciones</Text>

      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.card, { borderLeftColor: item.monto >= 0 ? '#2DCCD3' : '#FF5A5F' }]}
          >
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
            <Text style={styles.monto}>
              {item.monto >= 0 ? '+' : '-'}₡{Math.abs(item.monto).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5F1FB', padding: 20 },
  title: { fontSize: 24, color: '#1B396A', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 12, borderLeftWidth: 5 },
  descripcion: { fontSize: 16, fontWeight: '600', color: '#333' },
  fecha: { fontSize: 14, color: '#777' },
  monto: { fontSize: 18, marginTop: 5, fontWeight: 'bold' },
});