import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class Settings extends Component {
  render() {
    return <h1 data-testid="settings-title">Settings</h1>;
  }
}
export default connect()(Settings);
