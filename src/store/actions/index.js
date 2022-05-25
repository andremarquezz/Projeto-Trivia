export const SET_PLAYER = 'SET_PLAYER';

export const playerAction = (userInfo) => ({
  type: SET_PLAYER,
  userInfo,
});
