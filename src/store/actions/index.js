export const SET_PLAYER = 'SET_PLAYER';
export const SET_SCORE = 'SET_SCORE';

export const playerAction = (userInfo) => ({
  type: SET_PLAYER,
  userInfo,
});

export const scoreAction = (score) => ({
  type: SET_SCORE,
  score,
});
