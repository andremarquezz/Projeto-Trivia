import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends Component {
  state = {
    positiveFeedback: false,
  };

  handleFeedback = () => {
    const { assertions } = this.props;
    const threeAssertions = 3;
    if (assertions >= threeAssertions) {
      this.setState({
        positiveFeedback: true,
      });
    } else {
      this.setState({
        positiveFeedback: false,
      });
    }
  };

  render() {
    const { score } = this.props;
    const { positiveFeedback } = this.state;
    return (
      <>
        <Header />
        <div>
          <h1>Feedback</h1>
          {positiveFeedback ? (
            <p data-testid="feedback-text">Well Done!</p>
          ) : (
            <p data-testid="feedback-text">Could be better...</p>
          )}
        </div>
        <div>
          <p data-testid="feedback-total-question">{score}</p>
        </div>
      </>
    );
  }
}

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
