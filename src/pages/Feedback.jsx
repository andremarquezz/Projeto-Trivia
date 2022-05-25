import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class Feedback extends Component {
  render() {
    return <h1>Feedback</h1>;
  }
}
export default connect()(Feedback);
