import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Ranking extends Component {
  state = {
    players: JSON.parse(localStorage.getItem('ranking')) || [],
  };

  componentDidMount() {
    this.handleRanking();
  }

  handleRanking = () => {
    const { players } = this.state;
    return players
      .sort((a, b) => b.score - a.score)
      .map(({ name, score }, i) => (
        <div key={ i }>
          <p data-testid={ `player-name-${i}` }>{name}</p>
          <p data-testid={ `player-score-${i}` }>{score}</p>
        </div>
      ));
  };

  render() {
    const { history } = this.props;
    return (
      <>
        <h1 data-testid="ranking-title">Ranking</h1>
        {this.handleRanking()}
        <button
          data-testid="btn-go-home"
          type="button"
          onClick={ () => history.push('/') }
        >
          Home
        </button>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
export default connect()(Ranking);
