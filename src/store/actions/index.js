export const SET_PLAYER = 'SET_PLAYER';

export const playerAction = (userInfo) => ({
  type: SET_PLAYER,
  userInfo,
});

export const setPlayerToken = (user) => async (dispatch) => {
  const API = 'https://opentdb.com/api_token.php?command=request';
  const data = await (await fetch(API)).json();
  const token = JSON.stringify(data.token);
  localStorage.setItem('token', token);
  const userInfo = {
    token: data.token,
    user,
  };
  dispatch(playerAction(userInfo));
};
