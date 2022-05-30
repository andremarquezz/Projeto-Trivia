import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';

describe('Testa o componente Settings', () => {
  it('Testa se a pagina possui o texto Settings', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/settings');
    const textSettings = screen.getByText(/Settings/i);
    expect(textSettings).toBeInTheDocument();
  });
});
