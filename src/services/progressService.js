import { apiClient } from './apiClient.js';

class ProgressService {
  constructor() {
    this.api = apiClient;
  }

  async submitExerciseAttempt({ userId, exerciseId, userAnswer, timeTaken = 0, hintsUsed = 0 }) {
    try {
      const response = await this.api.post('/api/exercise/submit', {
        user_id: userId,
        exercise_id: exerciseId,
        user_answer: userAnswer,
        time_taken: timeTaken,
        hints_used: hintsUsed
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error, 'Error submitting exercise attempt');
    }
  }

  async getUserProgress(userId) {
    try {
      const response = await this.api.get(`/api/progress/${userId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return this.handleError(error, 'Error fetching user progress');
    }
  }

  async getUserLevelProgress(userId, levelId) {
    try {
      const response = await this.api.get(`/api/progress/${userId}/${levelId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return this.handleError(error, 'Error fetching level progress');
    }
  }

  async getLevelRanking(levelId) {
    try {
      const response = await this.api.get(`/api/ranking/${levelId}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return this.handleError(error, 'Error fetching level ranking');
    }
  }

  handleError(error, defaultMessage) {
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    return { success: false, data: null, message };
  }
}

export const progressService = new ProgressService();
export default progressService;


