import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { setPlayerToken } from '../store/actions';

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
      },
    );
  };

  fetchGravatar = (user) => {
    const { email, name } = user;
    const id = md5(email).toString();
    const picture = `https://www.gravatar.com/avatar/${id}`;
    const ranking = JSON.stringify([{ name, score: 0, picture }]);
    localStorage.setItem('ranking', ranking);
  };

  handlePlayButton = () => {
    const { dispatchUser, history } = this.props;
    const { user } = this.state;
    dispatchUser(user);
    this.fetchGravatar(user);
    history.push('/game');
  };

  render() {
    const { user, isEnterButtonDisabled } = this.state;
    const { email, name } = user;
    return (
      <div className="Login">
        <h3 className="text-center">Login</h3>
        <section className="login-inputs">
          <input
            data-testid="input-gravatar-email"
            type="email"
            name="email"
            value={ email }
            onChange={ this.onInputChange }
            placeholder="Digite seu E-mail"
          />
          <input
            data-testid="input-player-name"
            type="text"
            name="name"
            value={ name }
            onChange={ this.onInputChange }
            placeholder="Digite seu nome"
          />
        </section>
        <div className="button-login enabled">
          <button
            data-testid="btn-play"
            type="button"
            disabled={ isEnterButtonDisabled }
            onClick={ this.handlePlayButton }
          >
            Play
          </button>
          <Link to="/settings" data-testid="btn-settings">
            <button type="button">Settings</button>
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
  dispatchUser: (user) => dispatch(setPlayerToken(user)),
});

export default connect(null, mapDispatchToProps)(Login);
