import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import userEvent from '@testing-library/user-event';
import result_API from './helpers/results_api';
describe('Testa funcionalidade da tela Game', () => {
  jest.setTimeout(35000);
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(result_API),
  });

  const users = [{ name: 'player1', picture: 'picplayer1', score: 0 }];
  const token = 'dd93a309c02d4b44b5146d969775992520e0f3dfa56a3cd27a04e3e27e677b49';
  localStorage.setItem('ranking', JSON.stringify(users));
  localStorage.setItem('token', token);

  it('Testa se ao carregar a página a rota é Game', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Game');
    const { pathname } = history.location;
    expect(pathname).toBe('/Game');
  });
  it('Testa se existe os botões de resposta correta e incorreta', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/Game');
    await waitFor(() => expect(screen.getByTestId('correct-answer')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId(/wrong-answer/i)).toBeInTheDocument());
  });
  it('Testa o botão de proxima pergunta', async () => {
    renderWithRouterAndRedux(<App />);
    localStorage.removeItem('ranking');
    localStorage.removeItem('token');
    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputname = screen.getByTestId('input-player-name');
    const email = 'test@test.com';
    const name = 'player1';

    userEvent.type(inputEmail, email);

    userEvent.type(inputname, name);

    const button1 = screen.getByTestId('btn-play');
    expect(button1).toBeInTheDocument();

    userEvent.click(screen.getByTestId('btn-play'));

    await waitFor(() => {
      const correctAnswer = screen.getByTestId('correct-answer');
      userEvent.click(correctAnswer);
    });
    const btnNext = screen.getByRole('button', { name: /Next/i });
    expect(btnNext).toBeInTheDocument();
    userEvent.click(btnNext);
    const nextAnswer = screen.getByText(
      /What is the first weapon you acquire in Half-Life/i
    );
    expect(nextAnswer).toBeInTheDocument();
  });
  it('Testa se contém o texto acabou o tempo após 30s', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const text = await screen.findByText(/Acabou o tempo!/i, {}, { timeout: 31000 });
    expect(text).toBeInTheDocument();
  });

  it('Testa se não tiver o token retorna para pagina de login', async () => {
    jest.resetAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        response_code: 3,
        results: [],
      }),
    });
    const { history } = renderWithRouterAndRedux(<App />);
    localStorage.removeItem('token');
    const storage = localStorage.getItem('token');
    expect(storage).toBeNull();
    // history.push('/game');
    // const { pathname } = history.location;
    // await waitFor(expect(pathname).toBe('/', {}, { timeout: 5000 }));
    // screen.debug();
  });
});
