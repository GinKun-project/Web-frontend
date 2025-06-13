import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const authApi = {
  signup: async (form) => {
    const res = await axios.post(`${API_BASE}/signup`, form);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axios.post(`${API_BASE}/login`, credentials);
    return res.data;
  }
};
