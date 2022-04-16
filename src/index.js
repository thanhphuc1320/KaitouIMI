import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


// CSS
import './static/css/App.css';
import './static/css/vendor-styles.css';

import App from './App';
import allReducers from './store/reducers';
import { watcherSaga } from './sagas/index';
import { registerFirebaseServiceWorker } from './serviceWorker';

// create the saga middleware
const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [sagaMiddleware];

const enhancers = [applyMiddleware(...middlewares)];

// Redux store
const Store = createStore(allReducers, composeEnhancer(...enhancers));

// run the saga
sagaMiddleware.run(watcherSaga);

registerFirebaseServiceWorker();

const theme = createMuiTheme({
  palette: {
    primary1Color: '#f54a70',
    accent1Color: '#cb55e3',
  },
  fontFamily: 'Nunito, sans-serif',
});

const themeV0 = getMuiTheme({
  palette: {
    primary1Color: '#f54a70',
    accent1Color: '#cb55e3',
  },
  fontFamily: 'Nunito, sans-serif',
});

ReactDOM.render(
  <Provider store={Store}>
    <MuiThemeProvider theme={theme}>
        <V0MuiThemeProvider muiTheme={themeV0}>
          <App />
      </V0MuiThemeProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
