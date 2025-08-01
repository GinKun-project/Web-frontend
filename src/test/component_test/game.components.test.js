import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameScreen from '../../presentation/game/GameScreen';
import GameLoader from '../../presentation/game/GameLoader';
import UserProfile from '../../presentation/game/UserProfile';

// Mock the use cases and APIs
jest.mock('../../domain/auth/usecases');
jest.mock('../../data/auth/authApi');

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Game Components - Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('GameScreen renders with game mode options', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    expect(screen.getByText(/VS AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Multiplayer/i)).toBeInTheDocument();
  });

  test('GameScreen displays user information', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  test('GameScreen handles logout button click', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
  });

  test('GameScreen navigates to VS AI mode', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    const vsAiButton = screen.getByText(/VS AI/i);
    fireEvent.click(vsAiButton);

    // Should navigate to VS AI screen
    expect(screen.getByText(/VS AI Game/i)).toBeInTheDocument();
  });

  test('GameScreen navigates to multiplayer mode', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    const multiplayerButton = screen.getByText(/Multiplayer/i);
    fireEvent.click(multiplayerButton);

    // Should navigate to multiplayer screen
    expect(screen.getByText(/Multiplayer Game/i)).toBeInTheDocument();
  });

  test('GameLoader displays loading message', () => {
    renderWithRouter(<GameLoader />);

    expect(screen.getByText(/Loading game/i)).toBeInTheDocument();
  });

  test('GameLoader shows loading animation', () => {
    renderWithRouter(<GameLoader />);

    const loadingElement = screen.getByTestId('loading-animation');
    expect(loadingElement).toBeInTheDocument();
  });

  test('GameLoader disappears after loading timeout', async () => {
    jest.useFakeTimers();
    
    renderWithRouter(<GameLoader />);

    expect(screen.getByText(/Loading game/i)).toBeInTheDocument();

    // Advance timers to simulate loading completion
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText(/Loading game/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('UserProfile displays user information correctly', () => {
    const mockUser = { 
      id: 1, 
      username: 'testuser', 
      email: 'test@test.com',
      level: 5,
      experience: 1250
    };
    
    renderWithRouter(<UserProfile user={mockUser} />);

    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/Level: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience: 1250/i)).toBeInTheDocument();
  });

  test('UserProfile handles profile updates', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnUpdate = jest.fn();
    
    renderWithRouter(
      <UserProfile user={mockUser} onUpdate={mockOnUpdate} />
    );

    const updateButton = screen.getByText(/Update Profile/i);
    fireEvent.click(updateButton);

    expect(mockOnUpdate).toHaveBeenCalled();
  });

  test('GameScreen shows achievements link', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
  });

  test('GameScreen shows settings link', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  test('GameScreen handles keyboard navigation', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockOnLogout = jest.fn();
    
    renderWithRouter(
      <GameScreen user={mockUser} onLogout={mockOnLogout} />
    );

    // Test keyboard navigation
    const vsAiButton = screen.getByText(/VS AI/i);
    vsAiButton.focus();
    
    expect(vsAiButton).toHaveFocus();
  });
}); 