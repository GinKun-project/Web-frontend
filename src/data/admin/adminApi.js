import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const adminApi = {
  login: async (username, password) => {
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      username,
      password,
    });
    return response.data;
  },

  // Player CRUD
  getPlayers: async (token) =>
    axios.get(`${BASE_URL}/admin/players`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createPlayer: async (data, token) =>
    axios.post(`${BASE_URL}/admin/players`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updatePlayer: async (id, data, token) =>
    axios.put(`${BASE_URL}/admin/players/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deletePlayer: async (id, token) =>
    axios.delete(`${BASE_URL}/admin/players/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Character CRUD
  getCharacters: async (token) =>
    axios.get(`${BASE_URL}/admin/characters`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createCharacter: async (data, token) =>
    axios.post(`${BASE_URL}/admin/characters`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateCharacter: async (id, data, token) =>
    axios.put(`${BASE_URL}/admin/characters/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteCharacter: async (id, token) =>
    axios.delete(`${BASE_URL}/admin/characters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
