import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the EcoSim title', () => {
  render(<App />);
  const titleElement = screen.getByText(/EcoSim/i);
  expect(titleElement).toBeInTheDocument();
});
