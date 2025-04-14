/**
 * @file AppNavigator.tsx
 *
 * @description
 * Este archivo define el sistema de navegación principal de la aplicación móvil TecBank.
 * Utiliza React Navigation para gestionar el flujo entre pantallas como Login, Cliente, Cuentas,
 * Tarjetas, Préstamos, etc. Además, personaliza los encabezados de cada pantalla con estilos y títulos personalizados.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, Text } from 'react-native';

// Screens principales de la app
import LoginScreen from '../screens/LoginScreen';
import ClientScreen from '../screens/ClientScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import CardsScreen from '../screens/CardsScreen';
import PayCardScreen from '../screens/PayCardScreen';
import TransferScreen from '../screens/TransactionsScreen';
import LoansScreen from '../screens/LoansScreen';

/**
 * @typedef RootStackParamList
 * Define los parámetros aceptados por cada ruta/navegación de la app.
 */
export type RootStackParamList = {
  Login: undefined;
  Client: undefined;
  Accounts: undefined;
  AccountDetails: { accountId: string };
  Transactions: undefined;
  Cards: undefined;
  PayCard: { cardId: string };
  Loans: undefined;
};

// Instancia del stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * @function AppNavigator
 * @returns {JSX.Element}
 *
 * @description
 * Componente principal que configura las rutas de navegación de la app usando React Navigation.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#10264D', // Azul corporativo
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >

        {/* Pantalla de Login con logo personalizado */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require('../../assets/logo-tecbank.png')}
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
              />
            ),
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        />

        {/* Pantalla principal del cliente con logo y nombre de banco */}
        <Stack.Screen
          name="Client"
          component={ClientScreen}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/logo-tecbank.png')}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  TECBANK
                </Text>
              </View>
            ),
            headerTitleAlign: 'center',
          }}
        />

        {/* Rutas adicionales del sistema */}
        <Stack.Screen name="Accounts" component={AccountsScreen} options={{ title: 'Mis Cuentas' }} />
        <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} options={{ title: 'Detalles de Cuenta' }} />
        <Stack.Screen name="Transactions" component={TransferScreen} options={{ title: 'Transferencias' }} />
        <Stack.Screen name="Cards" component={CardsScreen} options={{ title: 'Tarjetas' }} />
        <Stack.Screen name="PayCard" component={PayCardScreen} options={{ title: 'Pagar Tarjeta' }} />
        <Stack.Screen name="Loans" component={LoansScreen} options={{ title: 'Mis Préstamos' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
