import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa funcionalidade da tela Feedback', () => {
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
    const user = [{ name: 'teste', picture: 'teste' }];
    localStorage.setItem('ranking', JSON.stringify(user));
    history.push('/feedback');
    const btnRank = screen.getByRole('button', { name: /Ranking/i });
    expect(btnRank).toBeInTheDocument();
    userEvent.click(btnRank);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });
  // it('', () => {});
});
