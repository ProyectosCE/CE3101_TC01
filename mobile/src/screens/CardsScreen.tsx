import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CardsScreen() {
  const { cliente } = useAuth();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showMovimientosId, setShowMovimientosId] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No autorizado</Text>
      </View>
    );
  }

  const getCuentaAsociada = (cuentaId: string) => {
    return cliente.cuentas.find((c) => c.id === cuentaId);
  };

  const tarjetas = [...cliente.tarjetas.debito, ...cliente.tarjetas.credito];

  const toggleCard = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId(prev => (prev === id ? null : id));
    setShowMovimientosId(null); // Ocultar movimientos al colapsar
  };

  const toggleMovimientos = (cardId: string) => {
    setShowMovimientosId(prev => (prev === cardId ? null : cardId));
  };

  const renderMovimientos = (movimientos: any[]) => (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.movTitle}>Movimientos:</Text>
      {movimientos.length === 0 ? (
        <Text style={styles.movEmpty}>No hay movimientos registrados</Text>
      ) : (
        movimientos.map((mov, index) => {
          const esGasto = ['compra', 'pago', 'transferencia'].includes(mov.tipo.toLowerCase());
          const simbolo = esGasto ? '-' : '+';

          return (
            <View key={index} style={styles.movRow}>
              <Text style={styles.movFecha}>{mov.fecha}</Text>
              <Text style={styles.movDesc}>{mov.descripcion}</Text>
              <Text style={styles.movMonto}>
                {simbolo}₡{Math.abs(mov.monto).toLocaleString()}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );

  const renderTarjeta = (tarjeta: any) => {
    const isExpanded = expandedCardId === tarjeta.id;
    const isCredito = tarjeta.tipo === 'Credito';
    const showMovs = showMovimientosId === tarjeta.id;
    const movimientos = tarjeta.movimientos || [];

    let disponible = '0.00';
    if (isCredito && tarjeta.cuenta_asociada) {
      const cuenta = getCuentaAsociada(tarjeta.cuenta_asociada);
      disponible = cuenta ? cuenta.saldo.toFixed(2) : '0.00';
    } else {
      disponible = tarjeta.saldo.toFixed(2);
    }

    const numeroVisible = tarjeta.numero.slice(-4);

    return (
      <TouchableOpacity key={tarjeta.id} style={styles.card} onPress={() => toggleCard(tarjeta.id)}>
        <View style={styles.iconBox}>
          {isCredito ? (
            <MaterialIcons name="credit-card" size={30} color="#10264D" />
          ) : (
            <FontAwesome5 name="money-check-alt" size={26} color="#10264D" />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Tarjeta {tarjeta.tipo}</Text>
          <Text style={styles.text}>**** **** **** {numeroVisible}</Text>
          <Text style={styles.saldo}>Disponible: ₡{parseFloat(disponible).toLocaleString()}</Text>

          {isExpanded && (
            <View style={styles.details}>
              {isCredito ? (
                <>
                  <Text style={styles.detailText}>Fecha vencimiento: {tarjeta.fecha_vencimiento}</Text>
                  <Text style={styles.detailText}>CVC: {tarjeta.codigo_seguridad}</Text>
                  <Text style={styles.detailText}>Límite: ₡{tarjeta.limite.toLocaleString()}</Text>
                  <Text style={styles.detailText}>Saldo usado: ₡{tarjeta.saldo.toLocaleString()}</Text>

                  <View style={styles.actions}>
                    <Button
                      title="Pagar tarjeta"
                      color="#1B396A"
                      onPress={() => navigation.navigate('PayCard', { cardId: tarjeta.id })}
                    />
                    <Button
                      title={showMovs ? 'Ocultar compras' : 'Ver compras'}
                      color="#2DCCD3"
                      onPress={() => toggleMovimientos(tarjeta.id)}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.detailText}>Saldo: ₡{tarjeta.saldo.toLocaleString()}</Text>
                </>
              )}
              {showMovs && renderMovimientos(movimientos)}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tarjetas</Text>
      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTarjeta(item)}
        contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF', padding: 20 },
  title: { fontSize: 24, color: '#10264D', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#2DCCD3',
  },
  iconBox: { marginRight: 15, justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600', color: '#39446D', marginBottom: 4 },
  text: { fontSize: 14, color: '#444' },
  saldo: { fontSize: 16, fontWeight: 'bold', marginTop: 6, color: '#10264D' },
  details: { marginTop: 10 },
  detailText: { fontSize: 13, color: '#555', marginBottom: 4 },
  actions: { marginTop: 10, gap: 10 },
  movTitle: { fontWeight: 'bold', color: '#39446D', marginTop: 10, marginBottom: 4 },
  movEmpty: { fontStyle: 'italic', fontSize: 13, color: '#777' },
  movRow: { marginBottom: 4 },
  movFecha: { fontSize: 12, color: '#777' },
  movDesc: { fontSize: 13, color: '#333' },
  movMonto: { fontSize: 14, fontWeight: 'bold' },
});
