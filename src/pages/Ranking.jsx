import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Ranking.css';
import Header from '../components/Header';

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
        <div key={i}>
          <p data-testid={`player-name-${i}`}>Nome : {name}</p>
          <p data-testid={`player-score-${i}`}>Pontos: {score}</p>
          <hr />
        </div>
      ));
  };

  render() {
    const { history } = this.props;
    return (
      <>
        <div>
          <button
            data-testid="btn-go-home"
            type="button"
            onClick={() => history.push('/')}
          >
            Home
          </button>
        </div>
        <div class="fade"></div>
        <section className="star-wars">
          <div className="crawl">
            <div className="title">
              <h1 data-testid="ranking-title ">Ranking</h1>
            </div>
            {this.handleRanking()}
          </div>
        </section>
        <Header />
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
export default connect()(Ranking);
