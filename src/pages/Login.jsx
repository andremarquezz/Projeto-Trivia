import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Login extends Component {
  state = {
    user: { email: '', nome: '' },
    isEnterButtonDisabled: true,
  };

  validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  validateUserInfo = () => {
    const { user } = this.state;
    const { email, nome } = user;
    const MAX_LENGTH = 3;
    const errorCases = [!this.validateEmail(email), nome.length < MAX_LENGTH];
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

  render() {
    const { user, isEnterButtonDisabled } = this.state;
    const { history } = this.props;
    const { email, nome } = user;
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
            name="nome"
            value={ nome }
            onChange={ this.onInputChange }
            placeholder="Digite seu nome"
          />
        </section>
        <div className="button-login enabled">
          <button
            data-testid="btn-play"
            type="submit"
            disabled={ isEnterButtonDisabled }
            onClick={ () => history.push('/game') }
          >
            Play
          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  // dispatchEmail: propTypes.func.isRequired,
};

export default connect()(Login);
