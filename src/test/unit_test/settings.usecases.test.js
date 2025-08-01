import { updateSettingUseCase, getSettingUseCase } from '../../domain/auth/usecases';
import { saveSetting, getSetting } from '../../infrastructure/storage/settingsStorage';

// Mock the settings storage
jest.mock('../../infrastructure/storage/settingsStorage');

describe('Settings Use Cases - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('updateSettingUseCase should call saveSetting with correct parameters', () => {
    updateSettingUseCase('volume', 0.8);

    expect(saveSetting).toHaveBeenCalledWith('volume', 0.8);
  });

  test('getSettingUseCase should call getSetting with correct parameters', () => {
    getSetting.mockReturnValue(0.8);
    
    const result = getSettingUseCase('volume', 0.5);

    expect(getSetting).toHaveBeenCalledWith('volume', 0.5);
    expect(result).toBe(0.8);
  });

  test('getSettingUseCase should return default value when setting not found', () => {
    getSetting.mockReturnValue(null);
    
    const result = getSettingUseCase('nonexistent', 'default');

    expect(getSetting).toHaveBeenCalledWith('nonexistent', 'default');
    expect(result).toBe('default');
  });

  test('updateSettingUseCase should handle string values', () => {
    updateSettingUseCase('username', 'testuser');

    expect(saveSetting).toHaveBeenCalledWith('username', 'testuser');
  });

  test('updateSettingUseCase should handle boolean values', () => {
    updateSettingUseCase('soundEnabled', true);

    expect(saveSetting).toHaveBeenCalledWith('soundEnabled', true);
  });

  test('updateSettingUseCase should handle numeric values', () => {
    updateSettingUseCase('difficulty', 3);

    expect(saveSetting).toHaveBeenCalledWith('difficulty', 3);
  });

  test('getSettingUseCase should handle null default value', () => {
    getSetting.mockReturnValue('saved_value');
    
    const result = getSettingUseCase('test', null);

    expect(getSetting).toHaveBeenCalledWith('test', null);
    expect(result).toBe('saved_value');
  });

  test('updateSettingUseCase should handle empty string key', () => {
    updateSettingUseCase('', 'value');

    expect(saveSetting).toHaveBeenCalledWith('', 'value');
  });

  test('getSettingUseCase should handle empty string key', () => {
    getSetting.mockReturnValue('default');
    
    const result = getSettingUseCase('', 'default');

    expect(getSetting).toHaveBeenCalledWith('', 'default');
    expect(result).toBe('default');
  });

  test('updateSettingUseCase should handle multiple consecutive calls', () => {
    updateSettingUseCase('volume', 0.5);
    updateSettingUseCase('volume', 0.8);
    updateSettingUseCase('volume', 1.0);

    expect(saveSetting).toHaveBeenCalledTimes(3);
    expect(saveSetting).toHaveBeenLastCalledWith('volume', 1.0);
  });
}); 