import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }
  
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const settingsApi = {
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/settings`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/settings`, settingsData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },

  updateSpecificSetting: async (key, value) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/settings/specific`,
        { key, value },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating specific setting:", error);
      throw error;
    }
  },

  resetSettings: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/settings/reset`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting settings:", error);
      throw error;
    }
  },

  deleteSettings: async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/settings`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting settings:", error);
      throw error;
    }
  },
}; 