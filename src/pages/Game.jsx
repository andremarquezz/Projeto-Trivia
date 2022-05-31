import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import './Game.css';
import { scoreAction, assertionsAction } from '../store/actions';

class Game extends Component {
  state = {
    results: [],
    currentQuestion: {},
    counter: 0,
    answers: [],
    assertions: 0,
    btnNextQuestion: false,
    colorQuestions: false,
    timer: 30,
    btnDisabled: false,
    enableTimer: true,
    score: 0,
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
      this.setState({ results }, () => this.currentQuestion());
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
    const fixPoint = 10;
    const { correct_answer: correct, difficulty } = currentQuestion;
    clearInterval(this.timer);
    const test = (userAnswer === correct) && (
      this.setState(
        ({ assertions, score }) => ({
          assertions: assertions + 1,
          score: score + timer * this.difficulty(difficulty) + fixPoint,
        }),
        () => {
          const { score, assertions } = this.state;
          const { setScore, setAssertions } = this.props;
          setScore(score);
          setAssertions(assertions);
          this.scoreLocalStorage(score);
        },
      )
    );
    this.setState({
      btnNextQuestion: true,
      colorQuestions: true,
      btnDisabled: false,
    });
    return test;
  };

  scoreLocalStorage = (score) => {
    const { namePlayer } = this.props;
    const allPlayers = JSON.parse(localStorage.getItem('ranking'));
    const player = allPlayers.find((user) => user.name === namePlayer);
    player.score = score;
    allPlayers[0] = player;
    localStorage.setItem('ranking', JSON.stringify(allPlayers));
  };

  difficulty = (difficulty) => {
    const pointHard = 3;
    switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    default:
      return pointHard;
    }
  };

  nextQuestion = () => {
    const { counter } = this.state;
    const counterQuestions = 5;
    const maxQuestions = 4;
    const { history } = this.props;
    const max = (counter < counterQuestions) && (
      this.intervalTimer(),
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
      )
    );
    return max;
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
      const result = (counterWrong < maxWrongs) && (counterWrong += 1);
      return result;
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
  setAssertions: PropTypes.func.isRequired,
  namePlayer: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setScore: (score) => dispatch(scoreAction(score)),
  setAssertions: (assertions) => dispatch(assertionsAction(assertions)),
});
const mapStateToProps = (state) => ({
  namePlayer: state.player.name,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
