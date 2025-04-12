/**
 * @file AccountsScreen.tsx
 *
 * @description Pantalla que muestra las cuentas del cliente, permitiendo expandir cada cuenta
 * para visualizar los movimientos asociados. Incluye animaciones al expandir.
 *
 * @author TecBank
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Habilita animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Pantalla AccountsScreen.
 *
 * Muestra una lista de cuentas del cliente autenticado, con opción de expandir para ver movimientos.
 *
 * @returns JSX.Element
 */
const AccountsScreen = () => {
  const { cliente } = useAuth();
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  /**
   * Formatea el valor monetario según la moneda.
   *
   * @param amount Monto numérico.
   * @param currency Moneda ('Dolares' o 'Colones').
   * @returns Cadena con el valor formateado.
   */
  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'Dolares'
      ? `$${amount.toFixed(2)}`
      : `₡${amount.toFixed(2)}`;
  };

  /**
   * Alterna la expansión de la tarjeta de cuenta para mostrar u ocultar movimientos.
   *
   * @param id ID de la cuenta seleccionada.
   */
  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedAccountId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {cliente?.Nombre_Completo}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus Cuentas</Text>

        <FlatList
          data={cliente?.cuentas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isExpanded = expandedAccountId === item.id;
            const movimientos = item.movimientos ?? [];

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={styles.accountLabel}>Cuenta {item.numero.slice(-4)} ({item.tipo})</Text>
                <Text>{item.currency}</Text>
                <Text style={styles.balance}>{formatCurrency(item.saldo, item.currency)}</Text>

                {isExpanded && (
                  <View style={styles.movimientos}>
                    <Text style={styles.movTitle}>Movimientos:</Text>
                    {movimientos.length > 0 ? (
                      movimientos.map((mov, index) => (
                        <View key={index} style={styles.movRow}>
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
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFF' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#10264D', marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#39446D', marginBottom: 10 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#7180AC',
  },
  accountLabel: { fontSize: 16, fontWeight: 'bold', color: '#39446D' },
  balance: { fontSize: 16, fontWeight: 'bold', color: '#10264D', marginTop: 5 },
  movimientos: { marginTop: 10 },
  movTitle: { fontWeight: '600', color: '#39446D', marginBottom: 5 },
  movRow: { marginBottom: 5 },
  movFecha: { fontSize: 12, color: '#555' },
  movDesc: { fontSize: 14 },
  movMonto: { fontSize: 14, fontWeight: 'bold' },
  movEmpty: { fontSize: 13, color: '#999', fontStyle: 'italic' },
});

export default AccountsScreen;
