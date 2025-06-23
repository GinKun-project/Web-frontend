import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Admin login 
export const loginAdmin = async ({ username, password }) => {
  const res = await axios.post(`${API_BASE}/admin/login`, {
    username,
    password,
  });
  return res.data;
};

// Player CRUD
export const fetchAllPlayers = async () => {
  const res = await axios.get(`${API_BASE}/admin/players`);
  return res.data;
};

export const createPlayer = async (data) => {
  const res = await axios.post(`${API_BASE}/admin/players`, data);
  return res.data;
};

export const updatePlayer = async (id, data) => {
  const res = await axios.put(`${API_BASE}/admin/players/${id}`, data);
  return res.data;
};

export const deletePlayer = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/players/${id}`);
  return res.data;
};

// Character CRUD
export const fetchAllCharacters = async () => {
  const res = await axios.get(`${API_BASE}/admin/characters`);
  return res.data;
};

export const createCharacter = async (data) => {
  const res = await axios.post(`${API_BASE}/admin/characters`, data);
  return res.data;
};

export const updateCharacter = async (id, data) => {
  const res = await axios.put(`${API_BASE}/admin/characters/${id}`, data);
  return res.data;
};

export const deleteCharacter = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/characters/${id}`);
  return res.data;
};
