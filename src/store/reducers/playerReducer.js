import { SET_PLAYER, SET_SCORE } from '../actions';

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
      name: action.userInfo.name,
      gravatarEmail: action.userInfo.email,
    };
  case SET_SCORE:
    return {
      ...state,
      score: action.score,
    };
  default:
    return state;
  }
};

export default playerReducer;
