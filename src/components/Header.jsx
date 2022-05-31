import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import trivia from '../images/trivia.png';
import settings from '../images/settings.png';
import './Header.css';

class Header extends Component {
  render() {
    const { score } = this.props;
    const userInfo = JSON.parse(localStorage.getItem('ranking'))[0];
    return (
      <header>
        <div className="center-header">
          <img
            src={userInfo.picture}
            alt="imageGravatar"
            data-testid="header-profile-picture"
            className='userImage'
          />
          <img alt="logoGameTrivia" src={trivia} className="logoTrivia" />
          <Link to="/settings">
            <img className="settings" src={settings} />
          </Link>
        </div>
        <div className="userInfo">
          <h2 data-testid="header-player-name">{userInfo.name}</h2>
          <span data-testid="header-score">{`${score} Pontos`}</span>
        </div>
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
