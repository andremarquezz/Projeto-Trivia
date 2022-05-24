import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    const userInfo = JSON.parse(localStorage.getItem('ranking'))[0];
    return (
      <header>
        <img
          src={ userInfo.picture }
          alt="imageGravatar"
          data-testid="header-profile-picture"
        />
        <h2 data-testid="header-player-name">{userInfo.name}</h2>
        <span data-testid="header-score">{userInfo.score}</span>
        <Link to="/settings">
          <button type="button">Settings</button>
        </Link>
      </header>
    );
  }
}

export default connect()(Header);
