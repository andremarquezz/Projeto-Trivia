import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import './Game.css';

class Game extends Component {
  state = {
    results: [],
    currentQuestion: {},
    counter: 0,
    answers: [],
    score: 0,
    btnNextQuestion: false,
    colorQuestions: false,
    timer: 30,
    btnDisabled: false,
    enableTimer: true,
  };

  componentDidMount() {
    this.fetchQuestions();
    this.intervalTimer();
  }

  componentDidUpdate() {
    const { timer } = this.state;
    if (timer === 0) {
      clearInterval(this.timer);
      this.handleTimer();
    }
  }

  intervalTimer = () => {
    const ONE_SECOND = 1000;
    this.timer = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, ONE_SECOND);
  };

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
        btnDisabled: false,
        enableTimer: true,
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
      btnDisabled: false,
    });
  };

  nextQuestion = () => {
    const { counter } = this.state;
    const { history } = this.props;
    const maxQuestions = 4;
    if (counter < maxQuestions) {
      this.intervalTimer();
      this.setState(
        (prevState) => ({
          counter: prevState.counter + 1,
        }),
        () => this.currentQuestion(),
      );
      if (counter === maxQuestions - 1) {
        history.push('/feedback');
      }
    }
  };

  fetchQuestions = async () => {
    const token = localStorage.getItem('token');
    const API = `https://opentdb.com/api.php?amount=5&token=${token}`;
    const data = await (await fetch(API)).json();
    this.validateToken(data);
  };

  handleTimer = () => {
    this.setState({
      timer: 30,
      btnDisabled: true,
      btnNextQuestion: true,
      enableTimer: false,
    });
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
    const {
      currentQuestion,
      answers,
      btnNextQuestion,
      colorQuestions,
      timer,
      btnDisabled,
      enableTimer,
    } = this.state;
    const { category, question } = currentQuestion;
    const { correct_answer: correct } = currentQuestion;
    console.log(timer);
    return (
      <>
        <Header />
        <p data-testid="question-category">{category}</p>
        <p data-testid="question-text">{question}</p>
        {enableTimer ? <span>{`${timer} segundos`}</span> : <span>Acabou o tempo!</span>}
        <div data-testid="answer-options">
          {answers.map((answer, i) => (answer === correct ? (
            <button
              disabled={ btnDisabled }
              className={ colorQuestions ? 'correct' : '' }
              type="button"
              data-testid="correct-answer"
              key={ i }
              onClick={ this.verifyAnswer }
            >
              {answer}
            </button>
          ) : (
            <button
              className={ colorQuestions ? 'wrong' : '' }
              type="button"
              disabled={ btnDisabled }
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
