import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const logger = createLogger({
  collapsed: true, // Collapse log messages
  diff: true, // Show the difference between the previous and next state
});

const middleware = [thunk, logger];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
