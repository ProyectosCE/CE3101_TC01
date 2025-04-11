import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View, Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import ClientScreen from '../screens/ClientScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import CardsScreen from '../screens/CardsScreen';
import PayCardScreen from '../screens/PayCardScreen';
import TransferScreen from '../screens/TransactionsScreen';
import LoansScreen from '../screens/LoansScreen';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#10264D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
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
