import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './src/config/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StripeProvider } from '@stripe/stripe-react-native';

const queryClient = new QueryClient();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey="pk_test_placeholder">
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <RootNavigator />
          </PaperProvider>
        </QueryClientProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
