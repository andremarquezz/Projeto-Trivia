import { combineReducers } from 'redux';
import player from './playerReducer';
import game from './gameReducer';

const rootReducer = combineReducers({ player, game });

export default rootReducer;
