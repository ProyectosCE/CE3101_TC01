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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Accounts'>;

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AccountsScreen({ navigation }: Props) {
  const { cliente } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No autorizado</Text>
      </View>
    );
  }

  const cuentasDebito = cliente.cuentas.filter((c) => c.tipo === 'Debito');
  const cuentasCredito = cliente.cuentas.filter((c) => c.tipo === 'Credito');
  const tarjetasDebito = cliente.tarjetas.debito;
  const tarjetasCredito = cliente.tarjetas.credito;

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderCuenta = (cuenta: any) => {
    const isExpanded = expandedId === cuenta.id;
    const tarjetasAsociadas = tarjetasDebito.filter((t) => t.cuenta_asociada === cuenta.numero);

    return (
      <TouchableOpacity
        key={cuenta.id}
        style={styles.card}
        onPress={() => toggleExpand(cuenta.id)}
      >
        <View style={styles.headerRow}>
          <FontAwesome5
            name={cuenta.tipo === 'Debito' ? 'money-check-alt' : 'credit-card'}
            size={22}
            color="#2DCCD3"
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={styles.cuentaTipo}>{cuenta.tipo}</Text>
            <Text style={styles.numero}>Número: {cuenta.numero}</Text>
            <Text>
              Saldo:{' '}
              {cuenta.currency === 'Dolares'
                ? `$${cuenta.saldo.toFixed(2)}`
                : `₡${cuenta.saldo.toLocaleString()}`}
            </Text>
          </View>
        </View>

        {isExpanded && cuenta.tipo === 'Debito' && (
          <View style={styles.details}>
            <Text style={styles.sectionTitle}>Movimientos</Text>
            {cuenta.movimientos?.length ? (
              cuenta.movimientos.map((mov: any, idx: number) => (
                <Text key={idx} style={styles.movement}>
                  {mov.fecha} - {mov.descripcion}:{' '}
                  {mov.tipo === 'deposito' ? '+' : '-'}
                  {cuenta.currency === 'Dolares'
                    ? `$${mov.monto.toFixed(2)}`
                    : `₡${mov.monto.toLocaleString()}`}
                </Text>
              ))
            ) : (
              <Text style={styles.noData}>Sin movimientos registrados</Text>
            )}

            <Text style={styles.sectionTitle}>Tarjetas Débito Asociadas</Text>
            {tarjetasAsociadas.length ? (
              tarjetasAsociadas.map((t) => (
                <Text key={t.id} style={styles.movement}>
                  **** **** **** {t.numero.slice(-4)} - Saldo: ₡{t.saldo.toLocaleString()}
                </Text>
              ))
            ) : (
              <Text style={styles.noData}>Sin tarjetas asociadas</Text>
            )}
          </View>
        )}

        {isExpanded && cuenta.tipo === 'Credito' && (
          <View style={styles.details}>
            <Text style={styles.sectionTitle}>Movimientos de tarjeta de crédito</Text>
            {tarjetasCredito[0]?.movimientos?.length ? (
              tarjetasCredito[0].movimientos.map((mov: any, idx: number) => (
                <Text key={idx} style={styles.movement}>
                  {mov.fecha} - {mov.descripcion}: ₡{mov.monto.toLocaleString()}
                </Text>
              ))
            ) : (
              <Text style={styles.noData}>Sin movimientos registrados</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuentas de {cliente.Nombre_Completo}</Text>

      <Text style={styles.subTitle}>Tarjetas de Débito</Text>
      {cuentasDebito.map(renderCuenta)}

      <Text style={styles.subTitle}>Tarjetas de Crédito</Text>
      {cuentasCredito.map(renderCuenta)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F1FB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1B396A',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#1B396A',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2DCCD3',
  },
  cuentaTipo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#2DCCD3',
  },
  numero: {
    fontSize: 15,
    marginBottom: 2,
  },
  details: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginTop: 10,
    color: '#39446D',
  },
  movement: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  noData: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
