import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testa funcionalidade da tela login', () => {
  let history;
  beforeEach(() => {
    history = renderWithRouterAndRedux(<App />).history;
  });

  it('Testa se a página de login está na rota /', () => {
    expect(history.location.pathname).toBe('/');
  });

  it('Verifica se tem dois input na tela ', () => {
    const input1 = screen.getByTestId('input-gravatar-email');
    const input2 = screen.getByTestId('input-player-name');
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
  });

  it('Verifica se tem dois button na tela', () => {
    const button1 = screen.getByTestId('btn-play');
    const button2 = screen.getByTestId('btn-settings');
    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
  });

  it('Verifica se a rota e alterada para /game ao clicar no Play', async () => {
    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputname = screen.getByTestId('input-player-name');
    const email = 'test@test.com';
    const name = 'test';

    userEvent.type(inputEmail, email);

    userEvent.type(inputname, name);

    const button1 = screen.getByTestId('btn-play');
    expect(button1).toBeInTheDocument();

    userEvent.click(screen.getByTestId('btn-play'));

    await waitFor(() =>
      expect(screen.getByTestId('header-player-name')).toBeInTheDocument()
    );
  });
});
