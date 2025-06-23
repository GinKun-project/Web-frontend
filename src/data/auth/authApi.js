import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const authApi = {
  login: async (credentials) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, credentials);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login request failed");
    }
  },

  signup: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/signup`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup request failed");
    }
  },
};
