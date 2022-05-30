import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa funcionalidade da tela de Ranking', () => {
  it('Verifica se é exibido os player em Ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const users = [
      { name: 'player1', picture: 'picplayer1' },
      { name: 'player2', picture: 'picplayer2' },
    ];
    localStorage.setItem('ranking', JSON.stringify(users));
    history.push('/Ranking');

    const player1 = screen.getByText('player1');
    expect(player1).toBeInTheDocument();
    const player2 = screen.getByText('player2');
    expect(player2).toBeInTheDocument();
  });
  it('Verifica se existe o botão de home na pagina Ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Ranking');
    const buttonHome = screen.getByRole('button', { name: /home/i });
    expect(buttonHome).toBeInTheDocument();
    userEvent.click(buttonHome);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
  it('Verifica se caso não tenha player retorna array vazio', () => {
    localStorage.clear()
    const initialState = {
      players: JSON.parse(localStorage.getItem('ranking')) || [],
    };
    renderWithRouterAndRedux(<App />, initialState, '/ranking');
    expect(initialState.players).toHaveLength(0);
  });
});
