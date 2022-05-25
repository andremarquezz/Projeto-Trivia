import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { score } = this.props;
    const userInfo = JSON.parse(localStorage.getItem('ranking'))[0];
    return (
      <header>
        <img
          src={ userInfo.picture }
          alt="imageGravatar"
          data-testid="header-profile-picture"
        />
        <h2 data-testid="header-player-name">{userInfo.name}</h2>
        <span data-testid="header-score">{score}</span>
        <Link to="/settings">
          <button type="button">Settings</button>
        </Link>
      </header>
    );
  }
}

Header.propTypes = {
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
});

export default connect(mapStateToProps)(Header);
