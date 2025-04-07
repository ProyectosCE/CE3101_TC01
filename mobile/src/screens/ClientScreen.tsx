import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Client'>;

export default function ClientScreen({ navigation }: Props) {
  const { cliente } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, {cliente?.Nombre_Completo}</Text>
      <Button title="Ver Cuentas" onPress={() => navigation.navigate('Accounts')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5F1FB' },
  title: { fontSize: 24, color: '#1B396A', marginBottom: 20, fontWeight: '600' },
});
