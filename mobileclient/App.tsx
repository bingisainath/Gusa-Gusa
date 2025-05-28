// App.js
import React, {useState} from 'react';
import {Provider} from 'react-redux';

import AppNavigator from './src/navigation/index';
import {store} from './src/redux/store';
import {SocketProvider} from './src/context/socketProvider';
import {ThemeProvider} from './src/context/themeProvider';
import {NavigationContainer} from '@react-navigation/native';
import NavigationManager from './src/helper/NavigationManager';

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider>
          <NavigationContainer
            ref={navigatorRef =>
              NavigationManager.setTopLevelNavigator(navigatorRef)
            }>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
};

export default App;
