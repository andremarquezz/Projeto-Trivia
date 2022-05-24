import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header>
        <Link to="/settings">
          <button type="button">Settings</button>
        </Link>
      </header>
    );
  }
}

export default connect()(Header);
