import axios from 'axios';

// Production backend URL
const api = axios.create({
  baseURL: 'https://job-alert-render-3.onrender.com/api',
  withCredentials: true, // Important for cookie-based authentication
});

/**
 * Fetches all jobs from the backend with pagination support.
 */
export const fetchJobsAPI = async (page: number = 1, limit: number = 100) => {
  try {
    const response = await api.get(`/jobs?page=${page}&limit=${limit}`);

    console.log('Jobs API Response:', {
      status: response.status,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      jobsCount: Array.isArray(response.data)
        ? response.data.length
        : response.data?.jobs?.length || 0
    });

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

    return [];
  }
};

/**
 * Searches jobs by keyword
 */
export const searchJobsAPI = async (
  query: string,
  page: number = 1,
  limit: number = 100
) => {
  try {
    const response = await api.get(
      `/jobs/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );

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