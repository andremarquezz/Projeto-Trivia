import { SET_PLAYER } from '../actions';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SET_PLAYER:
    return {
      ...state,
      name: action.userInfo.user.name,
      gravatarEmail: action.userInfo.user.email,
      token: action.userInfo.token,
    };
  default:
    return state;
  }
};

export default playerReducer;
