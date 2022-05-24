import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class Game extends Component {
  render() {
    return (
      <div>
        <p>Game</p>
      </div>
    );
  }
}

export default connect()(Game);
