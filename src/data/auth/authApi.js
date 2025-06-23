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
  }
};
