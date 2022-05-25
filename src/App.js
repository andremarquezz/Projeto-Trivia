import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <Switch>
      <Route exact path="/game" component={ Game } />
      <Route exact path="/settings" component={ Settings } />
      <Route exact path="/" component={ Login } />
      <Route exact path="/feedback" component={ Feedback } />
    </Switch>
  );
}
