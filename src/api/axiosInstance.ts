    import axios from 'axios';
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const axiosInstance=axios.create({baseURL:BASE_URL})
    axiosInstance.interceptors.response.use((response)=>{
        if(response.status==403){
            localStorage.clear()
            return response
        }
        return response
    },
  error => {
    // Check if the error response status is 403
    if (error.response && error.response.status === 403) {
      localStorage.clear();
      
      // Optionally, redirect to a login page or error page
      window.location.href = "/login";
    }
    // Return the error to allow further handling
    return Promise.reject(error);
  })
    export default axiosInstance



