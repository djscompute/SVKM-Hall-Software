import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

const API_URL = "http://localhost:3000";

const axiosMasterInstance = axios.create({
  baseURL: API_URL,
  //   timeout: 10000, // in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosMasterInstance;
