import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Ranking.css';
import audioBackground from '../assets/audios/background_ranking.mp3';

class Ranking extends Component {
  state = {
    players: JSON.parse(localStorage.getItem('ranking')) || [],
  };

  audio = 0;

  componentDidMount() {
    this.audio = new Audio(audioBackground);
    this.audio.volume = 0.1;
    this.audio.play();
  }
  componentWillUnmount() {
    this.audio.pause();
  }

  handleRanking = () => {
    const { players } = this.state;
    return players
      .sort((a, b) => b.score - a.score)
      .map(({ name, score }, i) => (
        <div key={i}>
          <p>Nome : {name}</p>
          <p>Pontos: {score}</p>
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
            type="button"
            onClick={() => history.push('/')}
            className="btn btn-primary"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => history.push('/feedback')}
            className="btn btn-primary"
          >
            Feedback
          </button>
        </div>
        <div className="fade"></div>
        <section className="slide">
          <div className="crawl">
            <div className="title">
              <h1>Ranking</h1>
            </div>
            {this.handleRanking()}
          </div>
        </section>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
export default connect()(Ranking);
