// App.js
import React, {useState} from 'react';
import {Provider} from 'react-redux';

import AppNavigator from './src/navigation/index';
import {store} from './src/redux/store';
import {SocketProvider} from './src/context/socketProvider';
import {ThemeProvider} from './src/context/themeProvider';
import {NavigationContainer} from '@react-navigation/native';
import NavigationManager from './src/helper/NavigationManager';
import {ToastProvider} from 'react-native-toast-notifications';

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider>
          <ToastProvider>
            <NavigationContainer
              ref={navigatorRef =>
                NavigationManager.setTopLevelNavigator(navigatorRef)
              }>
              <AppNavigator />
            </NavigationContainer>
          </ToastProvider>
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
};

export default App;
