import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // You can add custom back button handling here if needed
        return false; // Let the default back button behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(driver)" />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/forgotPassword" />
      </Stack>
    </Provider>
  );
}