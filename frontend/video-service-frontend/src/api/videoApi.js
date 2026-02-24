import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/videos';

/**
 * Get a video by its ID
 * @param {string|number} id - The video ID
 * @returns {Promise<Object>} The video data
 */
export const getVideoById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching video by ID ${id}:`, error);
        throw error;
    }
};

/**
 * Get all videos by class ID
 * @param {string|number} classId - The class ID
 * @returns {Promise<Array>} List of videos for the class
 */
export const getVideosByClassId = async (classId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/class/${classId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching videos for class ${classId}:`, error);
        throw error;
    }
};

/**
 * Create a new video
 * @param {Object} data - The video data to create
 * @returns {Promise<Object>} The created video
 */
export const createVideo = async (data) => {
    try {
        const response = await axios.post(API_BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating video:', error);
        throw error;
    }
};

/**
 * Update an existing video
 * @param {string|number} id - The video ID
 * @param {Object} data - The updated video data
 * @returns {Promise<Object>} The updated video
 */
export const updateVideo = async (id, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating video ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a video
 * @param {string|number} id - The video ID
 * @returns {Promise<void>}
 */
export const deleteVideo = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting video ${id}:`, error);
        throw error;
    }
};

/**
 * Mark a video as completed for a student
 * @param {string|number} id - The video ID
 * @param {string|number} studentId - The student ID
 * @returns {Promise<Object>} The completion status
 */
export const markVideoCompleted = async (id, studentId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${id}/complete`, { studentId });
        return response.data;
    } catch (error) {
        console.error(`Error marking video ${id} as completed for student ${studentId}:`, error);
        throw error;
    }
};

/**
 * Get completion status of a video for a student
 * @param {string|number} id - The video ID
 * @param {string|number} studentId - The student ID
 * @returns {Promise<Object>} The completion status
 */
export const getCompletionStatus = async (id, studentId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}/completion/${studentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching completion status for video ${id} and student ${studentId}:`, error);
        throw error;
    }
};
