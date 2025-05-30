/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: ClientScreen
 * Pantalla principal para clientes, mostrando accesos rápidos a cuentas, tarjetas, préstamos y transacciones.
 *
 * Props:
 * - navigation: Permite la navegación entre pantallas usando React Navigation.
 *
 * Context:
 * - cliente: Objeto con la información del cliente autenticado.
 *
 * Example:
 * <ClientScreen navigation={navigation} />
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Client'>;

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
    screen: 'Cards',
  },
  {
    id: 'loans',
    label: 'Mis Préstamos',
    icon: <MaterialIcons name="attach-money" size={28} color="#10264D" />,
    screen: 'Loans',
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

  /**
   * Navega a la pantalla seleccionada.
   * @param screen Nombre de la pantalla destino.
   */
  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as any);
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
