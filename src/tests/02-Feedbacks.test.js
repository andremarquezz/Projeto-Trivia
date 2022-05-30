import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa funcionalidade da tela Feedback', () => {
  const user = [{ name: 'teste', picture: 'teste', score: 0 }];
  localStorage.setItem('ranking', JSON.stringify(user));
  it('Testa se ao carregar a página a rota é feedback', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    history.push('/feedback');

    expect(history.location.pathname).toBe('/feedback');
  });

  it('Verifica se renderiza todos os textos e botões corretos', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');

    const textFeedback = screen.getByText(/Could be better.../i);
    expect(textFeedback).toBeInTheDocument();

    const btnRank = screen.getByRole('button', { name: /Ranking/i });
    expect(btnRank).toBeInTheDocument();

    const btnPlay = screen.getByRole('button', { name: /Play Again/i });
    expect(btnPlay).toBeInTheDocument();
  });

  it('Verifica se botão play again redireciona para Login', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');

    const btnPlay = screen.getByRole('button', { name: /Play Again/i });
    fireEvent.click(btnPlay);
    expect(history.location.pathname).toBe('/');
  });

  it('Verifica se ao clicar no botão ranking é redirecionado para a página de ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const btnRank = screen.getByRole('button', { name: /Ranking/i });
    expect(btnRank).toBeInTheDocument();
    userEvent.click(btnRank);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });
  it('Verifica se aparece mensagem Well Done acertando 3 perguntas', async () => {
    renderWithRouterAndRedux(<App />);
    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputname = screen.getByTestId('input-player-name');
    const email = 'test@test.com';
    const name = 'player1';

    userEvent.type(inputEmail, email);

    userEvent.type(inputname, name);

    const button1 = screen.getByTestId('btn-play');
    expect(button1).toBeInTheDocument();

    userEvent.click(screen.getByTestId('btn-play'));
    for (let i = 0; i < 5; i += 1) {
      await waitFor(() => {
        const correctAnswer = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer);
      });
      const btnNext = screen.getByRole('button', { name: /Next/i });
      expect(btnNext).toBeInTheDocument();
      userEvent.click(btnNext);
    }
    const textFeedback = screen.getByText(/Well Done!/i);
    expect(textFeedback).toBeInTheDocument();
  });
});
