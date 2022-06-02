import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import audioBackground from '../assets/audios/audio_background_credits.mp3';

import './Feedback.css';

class Feedback extends Component {
  audio = 0;

  componentDidMount() {
    this.audio = new Audio(audioBackground);
    this.audio.volume = 0.1;
    this.audio.play();
  }
  componentWillUnmount() {
    this.audio.pause();
  }

  handleFeedback = () => {
    const { assertions } = this.props;
    const threeAssertions = 3;
    return assertions >= threeAssertions;
  };

  render() {
    const { score, assertions, history } = this.props;
    return (
      <>
        <Header />
        <div className="containerBody">
          <h1>Feedback</h1>
          {this.handleFeedback() ? <p>Well Done!</p> : <p>Could be better...</p>}
          <p>Pontos: {score} </p>
          <p>Acertos: {assertions}</p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => history.push('/')}
          >
            Play Again
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => history.push('/ranking')}
          >
            Ranking
          </button>
        </div>
      </>
    );
  }
}

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
});

export default connect(mapStateToProps)(Feedback);
