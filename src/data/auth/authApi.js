import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export const authApi = {
  login: async (data) => {
    const response = await axios.post(`${BASE_URL}/login`, data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  signup: async (data) => {
    const response = await axios.post(`${BASE_URL}/signup`, data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  validateToken: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/validate`, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error("Token validation failed");
    }
  },

  logout: async (token) => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }
};
