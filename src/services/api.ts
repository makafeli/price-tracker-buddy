import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
  timeout: 10000,
});

// Interceptors for request and response
apiClient.interceptors.request.use((config) => {
  // Add any request headers or configurations here
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export const api = {
  async getPriceChanges() {
    return apiClient.get("/price-changes");
  },

  async searchTLD(query: string) {
    return apiClient.get(`/price-changes/search?query=${query}`);
  },

  async adminLogin(password: string): Promise<boolean> {
    // In a real application, this would make an API call to validate credentials
    return password === "admin123"; // Temporary simple password check
  },

  async checkAuthStatus(): Promise<boolean> {
    // In a real application, this would verify the session/token
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    return isAuthenticated;
  },
};
