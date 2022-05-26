export const SET_PLAYER = 'SET_PLAYER';
export const SET_SCORE = 'SET_SCORE';
export const SET_ASSERTIONS = 'SET_ASSERTIONS';

export const playerAction = (userInfo) => ({
  type: SET_PLAYER,
  userInfo,
});

export const scoreAction = (score) => ({
  type: SET_SCORE,
  score,
});

export const assertionsAction = (assertions) => ({
  type: SET_ASSERTIONS,
  assertions,
});
