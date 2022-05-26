import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import './Game.css';
import { scoreAction } from '../store/actions';

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
    totalScore: 0,
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
        timer: 30,
      },
      () => this.handleAnswer(),
    );
  };

  verifyAnswer = ({ target }) => {
    const userAnswer = target.innerHTML;
    const { currentQuestion, timer } = this.state;
    const correctPoint = 10;
    const { correct_answer: correct, difficulty } = currentQuestion;
    clearInterval(this.timer);
    if (userAnswer === correct) {
      this.setState(
        ({ score, totalScore }) => ({
          score: score + 1,
          totalScore: totalScore + timer * this.difficulty(difficulty) + correctPoint,
        }),
        () => {
          const { totalScore } = this.state;
          const { setScore } = this.props;
          setScore(totalScore);
          this.scoreLocalStorage(totalScore);
        },
      );
    }
    this.setState({
      btnNextQuestion: true,
      colorQuestions: true,
      btnDisabled: false,
    });
  };

  scoreLocalStorage = (totalScore) => {
    const ranking = JSON.parse(localStorage.getItem('ranking'))[0];
    const score = JSON.stringify([{ ...ranking, score: totalScore }]);
    localStorage.setItem('ranking', score);
  };

  difficulty = (difficulty) => {
    const pointHard = 3;
    if (difficulty === 'easy') {
      return 1;
    }
    if (difficulty === 'medium') {
      return 2;
    }
    if (difficulty === 'hard') {
      return pointHard;
    }
  };

  nextQuestion = () => {
    const { counter } = this.state;
    const counterQuestions = 5;
    const maxQuestions = 4;
    const { history } = this.props;
    if (counter < counterQuestions) {
      this.intervalTimer();
      this.setState(
        (prevState) => ({
          counter: prevState.counter + 1,
        }),
        () => {
          if (counter === maxQuestions) {
            history.push('/feedback');
          } else {
            this.currentQuestion();
          }
        },
      );
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
    const { category, question, correct_answer: correct } = currentQuestion;
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
  setScore: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setScore: (score) => dispatch(scoreAction(score)),
});
export default connect(null, mapDispatchToProps)(Game);
