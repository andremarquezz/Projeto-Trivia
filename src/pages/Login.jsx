import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { playerAction } from '../store/actions';
import './Login.css';
import trivia from '../assets/images/trivia.png';

class Login extends Component {
  state = {
    user: { email: '', name: '' },
    isEnterButtonDisabled: true,
  };

  validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  validateUserInfo = () => {
    const { user } = this.state;
    const { email, name } = user;
    const MAX_LENGTH = 3;
    const errorCases = [!this.validateEmail(email), name.length < MAX_LENGTH];
    const attrAreOk = errorCases.every((error) => error === false);
    this.setState({
      isEnterButtonDisabled: !attrAreOk,
    });
  };

  onInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState(
      ({ user }) => ({
        user: {
          ...user,
          [name]: value,
        },
      }),
      () => {
        this.validateUserInfo();
      }
    );
  };

  fetchGravatar = () => {
    const { user } = this.state;
    const { email, name } = user;
    const id = md5(email).toString();
    const picture = `https://www.gravatar.com/avatar/${id}`;
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const newRanking = JSON.stringify([{ name, score: 0, picture }, ...ranking]);
    localStorage.setItem('ranking', newRanking);
  };

  setPlayerToken = async () => {
    const API = 'https://opentdb.com/api_token.php?command=request';
    const data = await (await fetch(API)).json();
    const { token } = data;
    localStorage.setItem('token', token);
  };

  handlePlayButton = async () => {
    const { user } = this.state;
    const { dispatchUser, history } = this.props;
    await this.setPlayerToken();
    this.fetchGravatar();
    dispatchUser(user);
    history.push('/game');
  };

  render() {
    const { user, isEnterButtonDisabled } = this.state;
    const { email, name } = user;
    return (
      <div className="container">
        <img alt="logoGameTrivia" src={trivia} className="loginLogoTrivia" />

        <section className="container ">
          <input
            data-testid="input-gravatar-email"
            type="email"
            name="email"
            value={email}
            onChange={this.onInputChange}
            placeholder="Digite seu E-mail"
            className="form-control"
          />
          <input
            data-testid="input-player-name"
            type="text"
            name="name"
            value={name}
            onChange={this.onInputChange}
            placeholder="Digite seu nome"
            className="form-control"
          />
        </section>
        <div className="button-login enabled">
          <button
            data-testid="btn-play"
            type="button"
            disabled={isEnterButtonDisabled}
            onClick={this.handlePlayButton}
            className="btn btn-primary"
          >
            Play
          </button>
          <Link to="/settings">
            <button
              data-testid="btn-settings"
              type="button"
              className="btn btn-secondary"
            >
              Settings
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatchUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatchUser: (user) => dispatch(playerAction(user)),
});

export default connect(null, mapDispatchToProps)(Login);
