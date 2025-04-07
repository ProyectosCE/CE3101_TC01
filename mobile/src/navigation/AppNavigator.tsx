// Importaciones básicas de React y React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native'; // Para mostrar el logo en el header

// Importación de todas las pantallas de la aplicación
import LoginScreen from '../screens/LoginScreen';
import ClientScreen from '../screens/ClientScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';

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
  Transactions: { accountId: string };
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
          Pantalla de 

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
          options={{ title: 'Inicio' }} // Título personalizado
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
          component={TransactionsScreen} 
          options={{ title: 'Transacciones' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}