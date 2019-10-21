import {combineReducers} from 'redux';
import clock from './clock';
import settings from './settings';

export default combineReducers({
  clock,
  settings,
});
