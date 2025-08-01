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

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Complete login flow from login screen to game screen', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);

    renderApp();

    // Should start at login screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Fill and submit login form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should navigate to game screen after successful login
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
    });

    // Check that user data is stored in localStorage
    expect(localStorage.getItem('authToken')).toBe('test-token');
    expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockUser));
  });

  test('Complete signup flow from signup screen to game screen', async () => {
    const mockUser = { id: 1, username: 'newuser', email: 'new@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.signup.mockResolvedValue(mockResponse);

    renderApp();

    // Navigate to signup screen
    fireEvent.click(screen.getByText('Sign up'));

    // Fill and submit signup form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'new@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(authApi.signup).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123'
      });
    });

    // Check that user data is stored in localStorage
    expect(localStorage.getItem('authToken')).toBe('test-token');
    expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockUser));
  });

  test('Login error handling and user feedback', async () => {
    const error = new Error('Invalid credentials');
    error.response = { data: { message: 'Invalid credentials' } };
    authApi.login.mockRejectedValue(error);

    renderApp();

    // Fill and submit login form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should display error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Should stay on login screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('Signup error handling and user feedback', async () => {
    const error = new Error('Email already exists');
    error.response = { data: { message: 'Email already exists' } };
    authApi.signup.mockRejectedValue(error);

    renderApp();

    // Navigate to signup screen
    fireEvent.click(screen.getByText('Sign up'));

    // Fill and submit signup form with existing email
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'existinguser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'existing@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Should display error message
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });

    // Should stay on signup screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  test('Navigation between login and signup screens', () => {
    renderApp();

    // Start at login screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Navigate to signup
    fireEvent.click(screen.getByText('Sign up'));

    // Should be on signup screen
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Navigate back to login
    fireEvent.click(screen.getByText('Login'));

    // Should be back on login screen
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('Form validation prevents submission with empty fields', async () => {
    renderApp();

    // Try to submit login form with empty fields
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should not call API
    expect(authApi.login).not.toHaveBeenCalled();

    // Navigate to signup
    fireEvent.click(screen.getByText('Sign up'));

    // Try to submit signup form with empty fields
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Should not call API
    expect(authApi.signup).not.toHaveBeenCalled();
  });

  test('Session persistence after page reload', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    
    // Simulate existing session
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));

    renderApp();

    // Should automatically navigate to game screen
    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });
  });

  test('Logout functionality clears session and redirects to login', async () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
    const mockResponse = { token: 'test-token', user: mockUser };
    authApi.login.mockResolvedValue(mockResponse);
    authApi.logout.mockResolvedValue();

    renderApp();

    // Login first
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(/Choose your mode/i)).toBeInTheDocument();
    });

    // Find and click logout button (assuming it exists in GameScreen)
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Should clear localStorage and redirect to login
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userData')).toBeNull();
    });

    // Should be back on login screen
    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
  });

  test('Network error handling during login', async () => {
    const networkError = new Error('Network error');
    networkError.code = 'NETWORK_ERROR';
    authApi.login.mockRejectedValue(networkError);

    renderApp();

    // Fill and submit login form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Should display generic error message
    await waitFor(() => {
      expect(screen.getByText('Login failed.')).toBeInTheDocument();
    });
  });

  test('Form state management during user interaction', () => {
    renderApp();

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Test input state changes
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('password123');

    // Test clearing inputs
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
}); 