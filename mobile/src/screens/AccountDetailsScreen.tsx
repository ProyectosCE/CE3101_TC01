import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ClientScreen = () => {
  const { cliente } = useAuth();

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'Dolares' 
      ? `$${amount.toFixed(2)}` 
      : `₡${amount.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {cliente?.Nombre_Completo}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Cuentas</Text>
        <FlatList
          data={cliente?.cuentas}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Cuenta {item.numero.slice(-4)}</Text>
              <Text>{item.tipo} en {item.currency}</Text>
              <Text style={styles.balance}>
                {formatCurrency(item.saldo, item.currency)}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFF'
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 20
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#39446D',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#7180AC'
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10264D',
    marginTop: 5
  }
});

export default ClientScreen;