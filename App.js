/**
 * Tuhu Clock
 *
 * @Author Dillon Zhang
 * @Date 2019年10月15日
 */

import React from 'react';
import Router from './src/router';
import {Provider} from 'react-redux';
import storeConfig from './src/store';

const App = () => (
  <Provider store={storeConfig()}>
    <Router />
  </Provider>
);

export default App;
