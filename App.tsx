import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from './src/navigation/stack/Stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AlertProvider } from './src/contexts/AlertContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            <NavigationContainer>
              <AppStack />
            </NavigationContainer>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;