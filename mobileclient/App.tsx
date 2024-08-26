// App.js
import React, {useState} from 'react';
import {Provider} from 'react-redux';

import AppNavigator from './src/navigation/index';
import {store} from './src/redux/store';
import {SocketProvider} from './src/context/socketProvider';
import {ThemeProvider} from './src/context/themeProvider';

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
};

export default App;
