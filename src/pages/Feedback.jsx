import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Header from '../components/Header';

class Feedback extends Component {
  handleFeedback = () => {
    const { assertions } = this.props;
    const threeAssertions = 3;
    return assertions >= threeAssertions;
  };

  render() {
    const { score, assertions, history } = this.props;
    return (
      <>
        {/* <Header /> */}
        <h1>Feedback</h1>
        {this.handleFeedback() ? (
          <p data-testid="feedback-text">Well Done!</p>
        ) : (
          <p data-testid="feedback-text">Could be better...</p>
        )}
        <p data-testid="feedback-total-score">{score}</p>
        <p data-testid="feedback-total-question">{assertions}</p>
        <button
          data-testid="btn-play-again"
          type="button"
          onClick={ () => history.push('/') }
        >
          Play Again
        </button>
        <button
          data-testid="btn-ranking"
          type="button"
          onClick={ () => history.push('/ranking') }
        >
          Ranking
        </button>
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
