import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginScreen from '../../presentation/auth/LoginScreen';
import SignupScreen from '../../presentation/auth/SignupScreen';
import { loginUseCase, signupUseCase } from '../../domain/auth/usecases';

// Mock the use cases
jest.mock('../../domain/auth/usecases');

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Auth Components - Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('LoginScreen renders login form with all required fields', () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('LoginScreen handles form submission with valid credentials', async () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    const mockResponse = { token: 'test-token', user: { id: 1, email: 'test@test.com' } };
    loginUseCase.mockResolvedValue(mockResponse);
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(loginUseCase).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
    });
  });

  test('LoginScreen displays error message on login failure', async () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    const error = new Error('Invalid credentials');
    error.response = { data: { message: 'Invalid credentials' } };
    loginUseCase.mockRejectedValue(error);
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('LoginScreen calls onSignup when signup link is clicked', () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockOnSignup).toHaveBeenCalled();
  });

  test('SignupScreen renders signup form with all required fields', () => {
    const mockOnLogin = jest.fn();
    
    renderWithRouter(
      <SignupScreen onLogin={mockOnLogin} />
    );

    expect(screen.getByText('Shadow Clash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  test('SignupScreen handles form submission with valid data', async () => {
    const mockOnLogin = jest.fn();
    const mockResponse = { token: 'test-token', user: { id: 1, username: 'testuser' } };
    signupUseCase.mockResolvedValue(mockResponse);
    
    renderWithRouter(
      <SignupScreen onLogin={mockOnLogin} />
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(signupUseCase).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      });
    });
  });

  test('SignupScreen displays error message on signup failure', async () => {
    const mockOnLogin = jest.fn();
    const error = new Error('Email already exists');
    error.response = { data: { message: 'Email already exists' } };
    signupUseCase.mockRejectedValue(error);
    
    renderWithRouter(
      <SignupScreen onLogin={mockOnLogin} />
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'existing@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  test('LoginScreen validates required fields', async () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    // Form should prevent submission with empty fields
    expect(loginUseCase).not.toHaveBeenCalled();
  });

  test('SignupScreen validates required fields', async () => {
    const mockOnLogin = jest.fn();
    
    renderWithRouter(
      <SignupScreen onLogin={mockOnLogin} />
    );

    const signupButton = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.click(signupButton);

    // Form should prevent submission with empty fields
    expect(signupUseCase).not.toHaveBeenCalled();
  });

  test('LoginScreen clears error message when user starts typing', async () => {
    const mockOnSignup = jest.fn();
    const mockOnLogin = jest.fn();
    const error = new Error('Invalid credentials');
    error.response = { data: { message: 'Invalid credentials' } };
    loginUseCase.mockRejectedValue(error);
    
    renderWithRouter(
      <LoginScreen onSignup={mockOnSignup} onLogin={mockOnLogin} />
    );

    // First, trigger an error
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Then, start typing to clear the error
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'new@test.com' }
    });

    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
  });
}); 