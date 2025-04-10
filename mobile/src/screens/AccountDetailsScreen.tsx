import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AccountDetailsScreen = () => {
  const { cliente } = useAuth();

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'Dolares'
      ? `$${amount.toFixed(2)}`
      : `₡${amount.toFixed(2)}`;
  };

  const getTarjetasDebitoAsociadas = (cuentaId: string) => {
    return cliente?.tarjetas.debito.filter(t => t.cuenta_asociada === cuentaId) || [];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {cliente?.Nombre_Completo}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Cuentas</Text>
        <FlatList
          data={cliente?.cuentas}
          renderItem={({ item }) => {
            const movimientosCuenta = item.movimientos ?? [];
            const tarjetasAsociadas = getTarjetasDebitoAsociadas(item.id);

            return (
              <View style={styles.card}>
                <Text style={styles.accountLabel}>
                  Cuenta {item.numero.slice(-4)} ({item.tipo})
                </Text>
                <Text>{item.currency}</Text>
                <Text style={styles.balance}>
                  {formatCurrency(item.saldo, item.currency)}
                </Text>

                {/* Movimientos de cuenta */}
                <View style={styles.movimientos}>
                  <Text style={styles.movTitle}>Movimientos:</Text>
                  {movimientosCuenta.length > 0 ? (
                    movimientosCuenta.map((mov, index) => (
                      <View key={`mov-${item.id}-${index}`} style={styles.movRow}>
                        <Text style={styles.movFecha}>{mov.fecha}</Text>
                        <Text style={styles.movDesc}>{mov.descripcion}</Text>
                        <Text style={styles.movMonto}>
                          {mov.monto >= 0 ? '+' : '-'}{formatCurrency(Math.abs(mov.monto), item.currency)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.movEmpty}>Sin movimientos registrados</Text>
                  )}
                </View>

                {/* Tarjetas asociadas */}
                {tarjetasAsociadas.length > 0 && (
                  <View style={styles.tarjetasAsociadas}>
                    <Text style={styles.movTitle}>Tarjetas de Débito Asociadas:</Text>
                    {tarjetasAsociadas.map((tarjeta) => (
                      <View key={tarjeta.id} style={{ marginBottom: 10 }}>
                        <Text style={styles.tarjetaLabel}>
                          • Tarjeta ****{tarjeta.numero.slice(-4)} (Saldo: ₡{tarjeta.saldo.toLocaleString()})
                        </Text>
                        {tarjeta.movimientos?.length > 0 ? (
                          tarjeta.movimientos.map((mov, index) => (
                            <View key={`mov-tarj-${tarjeta.id}-${index}`} style={styles.movRow}>
                              <Text style={styles.movFecha}>{mov.fecha}</Text>
                              <Text style={styles.movDesc}>{mov.descripcion}</Text>
                              <Text style={styles.movMonto}>
                                {mov.monto >= 0 ? '+' : '-'}{formatCurrency(Math.abs(mov.monto), item.currency)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.movEmpty}>Sin movimientos registrados</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFF' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#10264D', marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#39446D', marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#7180AC' },
  accountLabel: { fontSize: 16, fontWeight: 'bold', color: '#39446D' },
  balance: { fontSize: 16, fontWeight: 'bold', color: '#10264D', marginTop: 5 },
  movimientos: { marginTop: 10 },
  tarjetasAsociadas: { marginTop: 10 },
  movTitle: { fontWeight: '600', color: '#39446D', marginBottom: 5 },
  movRow: { marginBottom: 5 },
  movFecha: { fontSize: 12, color: '#555' },
  movDesc: { fontSize: 14 },
  movMonto: { fontSize: 14, fontWeight: 'bold' },
  movEmpty: { fontSize: 13, color: '#999', fontStyle: 'italic' },
  tarjetaLabel: { fontWeight: 'bold', color: '#2DCCD3', marginTop: 8 },
});

export default AccountDetailsScreen;
