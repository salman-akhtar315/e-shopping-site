import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Adjusted port to 8000 (6000 is an unsafe port in browsers)
    withCredentials: true // ensures cookies (like refreshToken/accessToken) are sent with requests
});

export default axiosInstance;
