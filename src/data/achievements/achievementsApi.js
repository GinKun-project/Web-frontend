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

export const achievementsApi = {
  getUserAchievements: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/achievements`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },

  updateAchievementProgress: async (achievementId, progress) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/achievements/${achievementId}/progress`,
        { progress },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating achievement progress:", error);
      throw error;
    }
  },

  unlockAchievement: async (achievementId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/achievements/${achievementId}/unlock`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      throw error;
    }
  },

  getAchievementStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/achievements/stats`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching achievement stats:", error);
      throw error;
    }
  },

  resetAchievements: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/achievements/reset`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error resetting achievements:", error);
      throw error;
    }
  }
}; 