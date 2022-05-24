import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
// import PropTypes from 'prop-types';

class Game extends Component {
  render() {
    return (
      <>
        <Header />
        <p>Game</p>
      </>
    );
  }
}

export default connect()(Game);
