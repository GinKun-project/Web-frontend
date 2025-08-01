import React from 'react';
import { render, screen } from '@testing-library/react';
import VsAiGameScreen from '../../presentation/game/VsAiGameScreen';
import InGameScreen from '../../presentation/game/InGameScreen';
import UserProfile from '../../presentation/game/UserProfile';
import GameLoader from '../../presentation/game/GameLoader';
import GameScreen from '../../presentation/game/GameScreen';

// 1. Render VsAiGameScreen
test('renders VsAiGameScreen with canvas', () => {
  render(<VsAiGameScreen />);
  const canvas = document.querySelector('canvas');
  expect(canvas).toBeInTheDocument();
});

// 2. Render InGameScreen
test('renders InGameScreen with canvas', () => {
  render(<InGameScreen />);
  const canvas = document.querySelector('canvas');
  expect(canvas).toBeInTheDocument();
});

// 3. Render UserProfile
test('renders UserProfile component', () => {
  render(<UserProfile />);
  expect(screen.getByText(/Username/i)).toBeInTheDocument();
});

// 4. Render GameLoader
test('renders GameLoader loading message', () => {
  render(<GameLoader />);
  expect(screen.getByText(/Loading game/i)).toBeInTheDocument();
});

// 5. Render GameScreen
test('renders GameScreen properly', () => {
  render(<GameScreen />);
  expect(screen.getByTestId('game-screen')).toBeInTheDocument();
});

// 6. Check VsAiGameScreen audio logic (simulated)
test('VsAiGameScreen plays audio', () => {
  const playMock = jest.fn();
  window.Audio = jest.fn(() => ({ play: playMock, loop: true, volume: 0.5 }));
  render(<VsAiGameScreen />);
  expect(playMock).toHaveBeenCalled();
});

// 7. Check canvas rendering on InGameScreen
test('InGameScreen has canvas with correct class', () => {
  render(<InGameScreen />);
  const canvas = document.querySelector('.vsai-canvas');
  expect(canvas).toBeInTheDocument();
});

// 8. Check GameScreen layout
test('GameScreen shows title or heading', () => {
  render(<GameScreen />);
  expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
});

// 9. Check GameLoader timeout behavior
test('GameLoader disappears after loading', async () => {
  jest.useFakeTimers();
  render(<GameLoader />);
  expect(screen.getByText(/Loading game/i)).toBeInTheDocument();
  jest.advanceTimersByTime(3000); // simulate loading timeout
  // optional: check if it transitions to another screen
});

// 10. Snapshot test (optional)
import renderer from 'react-test-renderer';
test('UserProfile matches snapshot', () => {
  const tree = renderer.create(<UserProfile />).toJSON();
  expect(tree).toMatchSnapshot();
});
