import axios from 'axios';

// Create a dedicated axios instance for API calls
// The baseURL is set to '/api', which will be handled by the Vite proxy.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookie-based authentication
});

/**
 * Fetches all jobs from the backend with pagination support.
 * @param page - Page number (default: 1)
 * @param limit - Jobs per page (default: 100)
 * @returns A promise that resolves to an array of jobs.
 */
export const fetchJobsAPI = async (page: number = 1, limit: number = 100) => {
  try {
    const response = await api.get(`/jobs?page=${page}&limit=${limit}`);
    
    console.log('Jobs API Response:', {
      status: response.status,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      jobsCount: Array.isArray(response.data) ? response.data.length : response.data?.jobs?.length || 0
    });
    
    // Handle both array format (legacy) and object format (new)
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
      return response.data.jobs;
    }
    
    console.warn('Unexpected jobs response format:', response.data);
    return [];
  } catch (error: any) {
    console.error("Failed to fetch jobs:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    // In case of a network error or non-2xx response, return an empty array
    // so the UI can gracefully show "No jobs found".
    return [];
  }
};

/**
 * Searches jobs by keyword
 * @param query - Search query
 * @param page - Page number
 * @param limit - Jobs per page
 */
export const searchJobsAPI = async (query: string, page: number = 1, limit: number = 100) => {
  try {
    const response = await api.get(`/jobs/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
      return response.data.jobs;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to search jobs:", error);
    return [];
  }
};

export default api;
