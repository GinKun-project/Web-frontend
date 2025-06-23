// src/domain/admin/usecases.js
import {
  loginAdmin,
  fetchAllPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  fetchAllCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../../data/admin/adminApi';

// Admin login use case
export const adminLoginUseCase = async (username, password) => {
  return await loginAdmin(username, password);
};

// Players CRUD use cases
export const getAllPlayersUseCase = async (token) => {
  return await fetchAllPlayers(token);
};

export const createPlayerUseCase = async (data, token) => {
  return await createPlayer(data, token);
};

export const updatePlayerUseCase = async (id, data, token) => {
  return await updatePlayer(id, data, token);
};

export const deletePlayerUseCase = async (id, token) => {
  return await deletePlayer(id, token);
};

// Characters CRUD use cases
export const getAllCharactersUseCase = async (token) => {
  return await fetchAllCharacters(token);
};

export const createCharacterUseCase = async (data, token) => {
  return await createCharacter(data, token);
};

export const updateCharacterUseCase = async (id, data, token) => {
  return await updateCharacter(id, data, token);
};

export const deleteCharacterUseCase = async (id, token) => {
  return await deleteCharacter(id, token);
};
