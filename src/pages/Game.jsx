import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import "./Game.css";

class Game extends Component {
  state = {
    results: [],
    currentQuestion: {},
    counter: 0,
    answers: [],
    score: 0,
    btnNextQuestion: false,
    colorQuestions: false,
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
      history.push('/');
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
    const forceOrderRandom = 0.5;
    const { correct_answer: correct, incorrect_answers: incorrect } = currentQuestion;
    const sortAnswers = [...incorrect, correct].sort(
      () => Math.random() - forceOrderRandom,
    );
    this.setState({
      answers: sortAnswers,
    });
  };

  currentQuestion = () => {
    const { counter, results } = this.state;
    this.setState(
      {
        currentQuestion: results[counter],
        btnNextQuestion: false,
        colorQuestions: false,
      },
      () => this.handleAnswer(),
    );
  };

  verifyAnswer = ({ target }) => {
    const userAnswer = target.innerHTML;
    const { currentQuestion } = this.state;
    const { correct_answer: correct } = currentQuestion;
    if (userAnswer === correct) {
      this.setState(({ score }) => ({
        score: score + 1,
      }));
    }

    this.setState({
      btnNextQuestion: true,
      colorQuestions: true,
    });
  };

  nextQuestion = () => {
    const { counter } = this.state;
    const maxQuestions = 4;
    if (counter < maxQuestions) {
      this.setState(
        (prevState) => ({
          counter: prevState.counter + 1,
        }),
        () => this.currentQuestion(),
      );
    }
  };

  fetchQuestions = async () => {
    const token = localStorage.getItem('token');
    const API = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const data = await (await fetch(API)).json();
    this.validateToken(data);
  };

  render() {
    const initialCounter = -1;
    let counterWrong = initialCounter;
    const counterAnswersWrong = () => {
      const maxWrongs = 3;
      if (counterWrong < maxWrongs) {
        counterWrong += 1;
      }
      return counterWrong;
    };
    const { currentQuestion, answers, btnNextQuestion, colorQuestions } = this.state;
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
              className={colorQuestions ? "correct" : "" }
              type="button"
              data-testid="correct-answer"
              key={ i }
              onClick={ this.verifyAnswer }
            >
              {answer}
            </button>
          ) : (
            <button
              className={colorQuestions ? "wrong" : "" }
              type="button"
              key={ i }
              data-testid={ `wrong-answer-${counterAnswersWrong()}` }
              onClick={ this.verifyAnswer }
            >
              {answer}
            </button>
          )))}
          {btnNextQuestion && (
            <button type="button" data-testid="btn-next" onClick={ this.nextQuestion }>
              Next
            </button>
          )}
        </div>
      </>
    );
  }
}
Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};
export default connect()(Game);
