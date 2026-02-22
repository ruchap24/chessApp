import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';
import { wsService } from '../services/websocket';
import { router } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { initialize, user, isLoading } = useAuthStore();

  useEffect(() => {
    initialize().then(() => {
      if (user) {
        wsService.connect();
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}