import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { authApi } from '../../data/auth/authApi';

// Mock the auth API
jest.mock('../../data/auth/authApi');

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Game Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Complete game flow: login -> game screen -> VS AI -> game', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Navigate to VS AI
    fireEvent.click(screen.getByText(/VS AI/i));

    // Should be on VS AI screen
    await waitFor(() => {
      expect(screen.getByText(/VS AI Game/i)).toBeInTheDocument();
    });

    // Navigate back to game screen
    fireEvent.click(screen.getByText(/Back to Menu/i));

    // Should be back on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });
  });

  test('Complete game flow: login -> game screen -> multiplayer -> game', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Navigate to multiplayer
    fireEvent.click(screen.getByText(/Multiplayer/i));

    // Should be on multiplayer screen
    await waitFor(() => {
      expect(screen.getByText(/Multiplayer Game/i)).toBeInTheDocument();
    });

    // Navigate back to game screen
    fireEvent.click(screen.getByText(/Back to Menu/i));

    // Should be back on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });
  });

  test('Game flow with achievements navigation', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Navigate to achievements
    fireEvent.click(screen.getByText(/Achievements/i));

    // Should be on achievements screen
    await waitFor(() => {
      expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
    });

    // Navigate back to game screen
    fireEvent.click(screen.getByText(/Back to Game/i));

    // Should be back on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });
  });

  test('Game flow with settings navigation', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Navigate to settings
    fireEvent.click(screen.getByText(/Settings/i));

    // Should be on settings screen
    await waitFor(() => {
      expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

    // Navigate back to game screen
    fireEvent.click(screen.getByText(/Back to Game/i));

    // Should be back on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });
  });

  test('Game flow with logout and session clearing', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);
    authApi.logout.mockResolvedValue();

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Logout
    fireEvent.click(screen.getByText(/Logout/i));

    // Should clear session and redirect to login
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
    });

    // Should be back on login screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
  });

  test('Game flow with session persistence after page reload', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    
    // Simulate existing session
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    renderApp();

    // Should automatically navigate to game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Should display user information
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  test('Game flow with invalid session handling', async () => {
    // Simulate invalid session
    localStorage.setItem('authToken', 'invalid-token');
    localStorage.setItem('userData', 'invalid-json');

    renderApp();

    // Should redirect to login screen due to invalid session
    await waitFor(() => {
      expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    // Should clear invalid session data
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  test('Game flow with network error during login', async () => {
    const networkError = new Error('Network error');
    networkError.code = 'NETWORK_ERROR';
    authApi.login.mockRejectedValue(networkError);

    renderApp();

    // Try to login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should display error and stay on login screen
    await waitFor(() => {
      expect(screen.getByText('Login failed.')).toBeInTheDocument();
    });

    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
  });

  test('Game flow with keyboard navigation', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Test keyboard navigation
    const vsAiButton = screen.getByText(/VS AI/i);
    vsAiButton.focus();
    
    expect(vsAiButton).toHaveFocus();

    // Test Enter key navigation
    fireEvent.keyDown(vsAiButton, { key: 'Enter', code: 'Enter' });

    // Should navigate to VS AI screen
    await waitFor(() => {
      expect(screen.getByText(/VS AI Game/i)).toBeInTheDocument();
    });
  });

  test('Game flow with multiple rapid navigation', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Login
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should be on game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Rapid navigation between screens
    fireEvent.click(screen.getByText(/VS AI/i));
    await waitFor(() => {
      expect(screen.getByText(/VS AI Game/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Back to Menu/i));
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Multiplayer/i));
    await waitFor(() => {
      expect(screen.getByText(/Multiplayer Game/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Back to Menu/i));
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Should handle rapid navigation without errors
    expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
  });
}); 