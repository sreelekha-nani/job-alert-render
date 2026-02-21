import axios from 'axios';

const api = axios.create({
  // The baseURL is set to '/api', which will be handled by the Vite proxy.
  baseURL: '/api',
  // This is crucial for cookie-based authentication.
  // It tells axios to send cookies received from the backend with subsequent requests.
  withCredentials: true, 
});

export default api;
