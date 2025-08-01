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

export const gameStatsApi = {
  // Get user's game stats
  getUserGameStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game-stats`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error getting game stats:", error);
      throw error;
    }
  },

  // Update game stats after a match
  updateGameStats: async (gameStats) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/game-stats/update`,
        { gameStats },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating game stats:", error);
      throw error;
    }
  },

  // Reset user's game stats
  resetGameStats: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/game-stats/reset`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error resetting game stats:", error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game-stats/leaderboard`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  },
}; 