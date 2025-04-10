// Importaciones básicas de React y React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, Text } from 'react-native'; // Para mostrar el logo en el header

// Importación de todas las pantallas de la aplicación
import LoginScreen from '../screens/LoginScreen';
import ClientScreen from '../screens/ClientScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CardsScreen from '../screens/CardsScreen'; // Nueva pantalla agregada
import PayCardScreen from '../screens/PayCardScreen'; //  Pantalla de pago agregada
import TransferScreen from '../screens/TransactionsScreen';

/**
 * Definición de tipos para las rutas y parámetros de navegacion
 * - Login: No requiere parámetros
 * - Client: No requiere parámetros 
 * - AccountDetails: Requiere accountId (string)
 * - Transactions: Requiere accountId (strin)
 */
export type RootStackParamList = {
  Login: undefined;
  Client: undefined;
  Accounts: undefined;
  AccountDetails: { accountId: string };
  Transactions: undefined;
  Cards: undefined; // Tipo de ruta para Mis Tarjetas
  PayCard: { cardId: string }; // Tipo de ruta para pago de tarjeta

};

// Creamos la instancia del navegador
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente principal de navegación
 * Configura todas las rutas de la aplicación y sus opciones
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Configuración global para todas las pantallas */}
      <Stack.Navigator
        initialRouteName="Login" // Ruta inicial al abrir la app
        screenOptions={{
          // Estilo común para todos los headers
          headerStyle: {
            backgroundColor: '#10264D', // Azul corporativo TecBank
          },
          headerTintColor: '#fff', // Color blanco para textos/botones
          headerTitleStyle: {
            fontWeight: 'bold', // Texto en negrita
          },
        }}
      >
        {/* 
          Pantalla de login con logo como título
        */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            headerTitle: () => (
              <Image 
                source={require('../../assets/logo-tecbank.png')} 
                style={{ 
                  width: 40, 
                  height: 40, 
                  resizeMode: 'contain' // Mantiene proporciones
                }}
              />
            ),
            headerTitleAlign: 'center', // Centra el logo
            headerShadowVisible: false, // Elimina la línea separadora
          }}
        />
        
        {/* 
          Resto de pantallas con configuración estándar:
          - Título personalizado para cada una
          - Heredan los estilos globales
        */}
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
        <Stack.Screen 
          name="Accounts" 
          component={AccountsScreen} 
          options={{ title: 'Mis Cuentas' }} 
        />
        <Stack.Screen 
          name="AccountDetails" 
          component={AccountDetailsScreen} 
          options={{ title: 'Detalles de Cuenta' }} 
        />
        <Stack.Screen 
          name="Transactions" 
          component={TransferScreen} 
          options={{ title: 'Transferencias' }} 
        />
        <Stack.Screen 
          name="Cards" 
          component={CardsScreen} 
          options={{ title: 'Tarjetas' }} 
        />
        <Stack.Screen 
          name="PayCard" 
          component={PayCardScreen} 
          options={{ title: 'Pagar Tarjeta' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


