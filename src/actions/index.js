import {createAction} from 'redux-actions';
import * as Types from './actionType';

export const setCheckIn = createAction(Types.SET_CHECK_IN);

export const setCheckOut = createAction(Types.SET_CHECK_OUT);

export const setClocks = createAction(Types.SET_CLOCKS);

export const setStatsDetail = createAction(Types.SET_STATS_DETAIL);

export const setSettings = createAction(Types.SET_SETTINGS);
