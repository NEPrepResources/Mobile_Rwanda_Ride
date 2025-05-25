import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function RootLayout() {
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