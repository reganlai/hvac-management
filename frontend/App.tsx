import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { QuoteProvider } from './src/context/QuoteContext';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QuoteProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </QuoteProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
