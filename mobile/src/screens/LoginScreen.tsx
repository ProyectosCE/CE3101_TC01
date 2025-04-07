import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

/**
 * Paleta de colores corporativos de TecBank
 */
const COLORS = {
  primary: '#10264D',
  secondary: '#7180AC',
  background: '#FAFAFF',
  textDark: '#170A1C',
  light: '#FDFDFD'
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

/**
 * Componente de pantalla de Login
 */
export default function LoginScreen({ navigation }: Props) {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  /**
   * Valida los campos del formulario
   */
  const validateFields = () => {
    if (!cedula.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    
    if (!/^\d{9}$/.test(cedula)) {
      Alert.alert('Error', 'La cédula debe tener 9 dígitos');
      return false;
    }
    return true;
  };

  /**
   * Maneja el proceso de autenticación
   */
  const handleLogin = async () => {
    if (!validateFields()) return;
    setIsLoading(true);

    try {
      const success = await login(cedula, password);
      if (success) {
        navigation.replace('Client'); // Navegación después de login exitoso
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TECBANK</Text>
        <Text style={styles.subtitle}>Portal de clientes</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Cédula"
            placeholderTextColor={COLORS.secondary}
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
            maxLength={9}
          />
          
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.secondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color={COLORS.secondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>INGRESAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.light,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: COLORS.textDark,
    fontSize: 16,
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});