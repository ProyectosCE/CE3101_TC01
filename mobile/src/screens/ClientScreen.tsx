import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Client'>;

// Opciones del menú principal
const options = [
  {
    id: 'accounts',
    label: 'Mis Cuentas',
    icon: <Ionicons name="wallet" size={28} color="#10264D" />,
    screen: 'Accounts',
  },
  {
    id: 'cards',
    label: 'Mis Tarjetas',
    icon: <FontAwesome5 name="credit-card" size={24} color="#10264D" />,
    screen: '', // Pendiente implementación
  },
  {
    id: 'loans',
    label: 'Mis Préstamos',
    icon: <MaterialIcons name="attach-money" size={28} color="#10264D" />,
    screen: '', // Pendiente implementación
  },
  {
    id: 'transactions',
    label: 'Transacciones',
    icon: <Entypo name="swap" size={26} color="#10264D" />,
    screen: 'Transactions',
  },
];

export default function ClientScreen({ navigation }: Props) {
  const { cliente } = useAuth();

  const handleNavigate = (screen: string) => {
    if (screen) {
      navigation.navigate(screen as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {cliente?.Nombre_Completo}</Text>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigate(item.screen)}
            disabled={!item.screen}
          >
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10264D',
    marginBottom: 30,
    textAlign: 'center',
  },
  list: {
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#2DCCD3',
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 18,
    color: '#10264D',
    fontWeight: '500',
  },
});
