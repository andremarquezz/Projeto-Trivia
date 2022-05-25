import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends Component {
  state = {
    results: [],
    currentQuestion: {},
    counter: 0,
    answers: [],
    score: 0,
  };

  componentDidMount() {
    this.fetchQuestions();
  }

  validateToken = (data) => {
    const { response_code: responseCode, results } = data;
    const { history } = this.props;
    const tokenInvalid = 3;
    if (responseCode === tokenInvalid) {
      localStorage.removeItem('token');
      history.push('/login');
    } else {
      this.setState(
        {
          results,
        },
        () => this.currentQuestion(),
      );
    }
  };

  handleAnswer = () => {
    const { currentQuestion } = this.state;
    const { correct_answer: correct, incorrect_answers: incorrect } = currentQuestion;
    const sortAnswers = [...incorrect, correct].sort();
    this.setState({
      answers: sortAnswers,
    });
  };

  currentQuestion = () => {
    const { counter, results } = this.state;
    this.setState(
      {
        currentQuestion: results[counter],
      },
      () => this.handleAnswer(),
    );
  };

  verifyAnswer = ({ target }) => {
    const userAnswer = target.innerHTML;
    const maxQuestions = 4;
    const { currentQuestion, counter } = this.state;
    const { correct_answer: correct } = currentQuestion;
    if (userAnswer === correct) {
      this.setState(({ score }) => ({
        score: score + 1,
      }));
    }
    if (counter < maxQuestions) {
      console.log(counter);
      this.setState(
        (prevState) => ({
          counter: prevState.counter + 1,
        }),
        () => this.currentQuestion(),
      );
    }
  };

  fetchQuestions = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const API = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const data = await (await fetch(API)).json();
    this.validateToken(data);
  };

  render() {
    const initialNumber = -1;
    let counter = initialNumber;
    const counterAnswerWrong = () => {
      counter += 1;
      return counter;
    };
    const { currentQuestion, answers } = this.state;
    const { category, question } = currentQuestion;
    const { correct_answer: correct } = currentQuestion;
    return (
      <>
        <Header />
        <p data-testid="question-category">{category}</p>
        <p data-testid="question-text">{question}</p>
        <div data-testid="answer-options">
          {answers.map((answer, i) => (answer === correct ? (
            <button
              type="button"
              data-testid="correct-answer"
              key={ i }
              onClick={ this.verifyAnswer }
            >
              {answer}
            </button>
          ) : (
            <button
              type="button"
              key={ i }
              data-testid={ `wrong-answer-${counterAnswerWrong()}` }
              onClick={ this.verifyAnswer }
            >
              {answer}
            </button>
          )))}
        </div>
      </>
    );
  }
}
Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
export default connect()(Game);
