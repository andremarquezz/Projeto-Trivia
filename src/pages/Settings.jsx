import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
// import PropTypes from 'prop-types';

class Settings extends Component {
  render() {
    return (
      <>
        <Header />
        <h1 data-testid="settings-title">Settings</h1>
      </>
    );
  }
}
export default connect()(Settings);
