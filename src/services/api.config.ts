import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { setupCache } from 'axios-cache-interceptor';

export const API_BASE_URL = process.env.VITE_API_URL || "https://tld-price-changes-api.vercel.app/api";

// Create axios instance with base configuration
const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add rate limiting - 100 requests per minute
const axiosRateLimited = rateLimit(axiosBase, { 
  maxRequests: 100,
  perMilliseconds: 60000,
  maxRPS: 10
});

// Add caching with 5 minute TTL by default
export const axiosInstance = setupCache(axiosRateLimited, {
  ttl: 5 * 60 * 1000,
  interpretHeader: true,
  methods: ['get'],
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    };

    // Log error for monitoring
    console.error('[API Error]', errorResponse);

    // Rethrow with structured error
    throw {
      ...errorResponse,
      isApiError: true,
    };
  }
);