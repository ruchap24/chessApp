import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { router } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♟️ Chess App</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, color: '#fff', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#16213e', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#e2b96f', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },
});