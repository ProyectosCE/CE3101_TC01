// Se importa React como dependencia principal
import React from 'react';

// Se importan componentes visuales desde React Native
import { View, Text, Button, StyleSheet } from 'react-native';

// Se importa el tipo de navegación para recibir parámetros desde el stack
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Se importa el contexto de autenticación para acceder al cliente actual
import { useAuth } from '../context/AuthContext';

// Se define el tipo de props esperadas por esta pantalla, incluyendo los parámetros de ruta
type Props = NativeStackScreenProps<RootStackParamList, 'AccountDetails'>;

// Componente principal que muestra los detalles de una cuenta seleccionada
export default function AccountDetailsScreen({ route, navigation }: Props) {
  // Se extrae el parámetro accountId desde la ruta
  const { accountId } = route.params;

  // Se obtiene el cliente actual desde el contexto de autenticación
  const { cliente } = useAuth();

  // Se busca la cuenta específica dentro del cliente autenticado
  const cuenta = cliente?.cuentas.find(c => c.id === accountId);

  // Si la cuenta no existe (ID inválido), se muestra un mensaje de error
  if (!cuenta) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cuenta no encontrada</Text>
      </View>
    );
  }

  // Se renderiza la información detallada de la cuenta
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Cuenta</Text>
      <Text style={styles.label}>Número: {cuenta.numero}</Text>
      <Text style={styles.label}>Tipo: {cuenta.tipo}</Text>
      <Text style={styles.label}>Saldo: ₡{cuenta.saldo.toLocaleString()}</Text>

      {/* Si la cuenta es de tipo Débito, se muestra botón para ver transacciones */}
      {cuenta.tipo === 'Debito' && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Ver Transacciones"
            onPress={() =>
              navigation.navigate('Transactions', { accountId: cuenta.id })
            }
            color="#1B396A"
          />
        </View>
      )}
    </View>
  );
}

// Se definen los estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F1FB', // Fondo según la paleta TecBank
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B396A', // Azul paleta
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
});
