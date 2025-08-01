import { loginUseCase, signupUseCase, logoutUseCase } from '../../domain/auth/usecases';
import { authApi } from '../../data/auth/authApi';

// Mock the authApi
jest.mock('../../data/auth/authApi');

describe('Auth Use Cases - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('loginUseCase should call authApi.login with correct parameters', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1, email: 'test@test.com' } };
    authApi.login.mockResolvedValue(mockResponse);

    const result = await loginUseCase({ email: 'test@test.com', password: 'password123' });

    expect(authApi.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
    expect(result).toEqual(mockResponse);
  });

  test('signupUseCase should call authApi.signup with correct parameters', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1, username: 'testuser' } };
    authApi.signup.mockResolvedValue(mockResponse);

    const result = await signupUseCase({ 
      username: 'testuser', 
      email: 'test@test.com', 
      password: 'password123' 
    });

    expect(authApi.signup).toHaveBeenCalledWith({ 
      username: 'testuser', 
      email: 'test@test.com', 
      password: 'password123' 
    });
    expect(result).toEqual(mockResponse);
  });

  test('logoutUseCase should call authApi.logout when token exists', async () => {
    localStorage.setItem('authToken', 'test-token');
    authApi.logout.mockResolvedValue();

    await logoutUseCase();

    expect(authApi.logout).toHaveBeenCalledWith('test-token');
  });

  test('logoutUseCase should not call authApi.logout when no token exists', async () => {
    await logoutUseCase();

    expect(authApi.logout).not.toHaveBeenCalled();
  });

  test('loginUseCase should throw error when authApi.login fails', async () => {
    const error = new Error('Login failed');
    authApi.login.mockRejectedValue(error);

    await expect(loginUseCase({ email: 'test@test.com', password: 'password123' }))
      .rejects.toThrow('Login failed');
  });

  test('signupUseCase should throw error when authApi.signup fails', async () => {
    const error = new Error('Signup failed');
    authApi.signup.mockRejectedValue(error);

    await expect(signupUseCase({ 
      username: 'testuser', 
      email: 'test@test.com', 
      password: 'password123' 
    })).rejects.toThrow('Signup failed');
  });

  test('loginUseCase should handle empty credentials', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1, email: '' } };
    authApi.login.mockResolvedValue(mockResponse);

    const result = await loginUseCase({ email: '', password: '' });

    expect(authApi.login).toHaveBeenCalledWith({ email: '', password: '' });
    expect(result).toEqual(mockResponse);
  });

  test('signupUseCase should handle special characters in username', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1, username: 'test_user123' } };
    authApi.signup.mockResolvedValue(mockResponse);

    const result = await signupUseCase({ 
      username: 'test_user123', 
      email: 'test@test.com', 
      password: 'password123' 
    });

    expect(authApi.signup).toHaveBeenCalledWith({ 
      username: 'test_user123', 
      email: 'test@test.com', 
      password: 'password123' 
    });
    expect(result).toEqual(mockResponse);
  });

  test('logoutUseCase should handle multiple logout calls', async () => {
    localStorage.setItem('authToken', 'test-token');
    authApi.logout.mockResolvedValue();

    await logoutUseCase();
    await logoutUseCase();

    expect(authApi.logout).toHaveBeenCalledTimes(2);
  });

  test('loginUseCase should handle network timeout', async () => {
    const timeoutError = new Error('Network timeout');
    timeoutError.code = 'NETWORK_TIMEOUT';
    authApi.login.mockRejectedValue(timeoutError);

    await expect(loginUseCase({ email: 'test@test.com', password: 'password123' }))
      .rejects.toThrow('Network timeout');
  });
}); 