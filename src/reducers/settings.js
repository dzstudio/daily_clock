import * as Types from '../actions/actionType';

const initialState = {
  lateLineHour: 9,
  lateLineMin: 0,
  offLineHour: 18,
  offLineMin: 0,
  overLineHour: 20,
  overLineMin: 0,
  nickName: '',
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case Types.SET_SETTINGS: {
      const {payload} = action;
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
}
