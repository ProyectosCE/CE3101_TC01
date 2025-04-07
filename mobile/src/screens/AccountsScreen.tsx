// Se importa React como dependencia principal
import React from 'react';

// Se importan componentes visuales de React Native
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Se importa el tipo de navegación stack desde las rutas principales
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Se importa el contexto de autenticación para obtener el cliente logueado
import { useAuth } from '../context/AuthContext';

// Se definen las props esperadas por esta pantalla desde el stack de navegación
type Props = NativeStackScreenProps<RootStackParamList, 'Accounts'>;

// Componente principal que muestra las cuentas del cliente
export default function AccountsScreen({ navigation }: Props) {
  // Se accede al cliente actual desde el contexto de autenticación
  const { cliente } = useAuth();

  // Si no hay cliente o no tiene cuentas, se muestra un mensaje de error o acceso denegado
  if (!cliente || !cliente.cuentas) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No autorizado o sin cuentas</Text>
      </View>
    );
  }

  // Se filtran las cuentas válidas (que tengan tipo definido)
  const cuentasValidas = cliente.cuentas.filter((c) => c && typeof c.tipo === 'string');

  // Se separan las cuentas por tipo
  const cuentasDebito = cuentasValidas.filter((c) => c.tipo === 'Debito');
  const cuentasCredito = cuentasValidas.filter((c) => c.tipo === 'Credito');

  // Función para renderizar una lista de cuentas, según su tipo
  const renderCuenta = (tipo: 'Debito' | 'Credito') => (
    <FlatList
      data={tipo === 'Debito' ? cuentasDebito : cuentasCredito}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          // Al presionar una cuenta, se navega a los detalles de la misma
          onPress={() =>
            navigation.navigate('AccountDetails', { accountId: item.id })
          }
        >
          <Text style={styles.cuentaTipo}>{item.tipo}</Text>
          <Text style={styles.numero}>Número: {item.numero}</Text>
          <Text>Saldo: ₡{item.saldo.toLocaleString()}</Text>
        </TouchableOpacity>
      )}
    />
  );

  // Se muestra la interfaz con las secciones de cuentas
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuentas de {cliente.Nombre_Completo}</Text>

      <Text style={styles.subTitle}>Tarjetas de Débito</Text>
      {renderCuenta('Debito')}

      <Text style={styles.subTitle}>Tarjetas de Crédito</Text>
      {renderCuenta('Credito')}
    </View>
  );
}

// Estilos visuales de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F1FB', // Color de fondo según la paleta TecBank
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
    borderLeftColor: '#2DCCD3', // Borde izquierdo de color para distinguir
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
});
