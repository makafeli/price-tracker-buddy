import axios from "axios";

export const API_BASE_URL = "https://tld-price-changes-api.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});