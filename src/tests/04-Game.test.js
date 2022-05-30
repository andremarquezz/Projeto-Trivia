import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa funcionalidade da tela Game', () => {
  const users = [{ name: 'player1', picture: 'picplayer1' }];
  localStorage.setItem('ranking', JSON.stringify(users));

  it('Testa se ao carregar a página a rota é Game', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Game');
    const { pathname } = history.location;
    expect(pathname).toBe('/Game');
  });
  it('Testa se existe os botões de resposta correta e incorreta', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Game');
    const correctAnswer = screen.getByTestId('correct-answer');
    const wrongAnswer = screen.getByTestId('wrong-answer-0');

    expect(correctAnswer).tobeInTheDocument();
    expect(wrongAnswer).tobeInTheDocument();
  });
  it.skip('Testa o botão de proxima pergunta', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Game');
    const btnNext = screen.findByTestId('btn-next');
    expect(btnNext).tobeInTheDocument();
  });
});
