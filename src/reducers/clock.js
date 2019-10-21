import * as Types from '../actions/actionType';

const initialState = {
  checkInTime: '',
  checkOutTime: '',
  clocks: {},
  statsYear: '',
  statsMonth: '',
};

export default function clock(state = initialState, action) {
  switch (action.type) {
    case Types.SET_CLOCKS: {
      const {payload} = action;
      return {
        ...state,
        clocks: payload.clocks,
      };
    }
    case Types.SET_CHECK_IN: {
      const {payload} = action;
      return {
        ...state,
        checkInTime: payload.onClock ? payload.onClock : '',
      };
    }
    case Types.SET_CHECK_OUT: {
      const {payload} = action;
      return {
        ...state,
        checkOutTime: payload.offClock ? payload.offClock : '',
      };
    }
    case Types.SET_STATS_DETAIL: {
      const {payload} = action;
      return {
        ...state,
        statsYear: payload.year ? payload.year : '',
        statsMonth: payload.month ? payload.month : '',
      };
    }
    default:
      return state;
  }
}
