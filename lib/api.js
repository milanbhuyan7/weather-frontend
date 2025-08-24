import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://liveweathertrack.onrender.com/api"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 40000, // Increased from 10000ms to 30000ms (30 seconds)
  headers: {
    "Content-Type": "application/json",
  },
})

// Weather API service
export const weatherAPI = {
  // Cities endpoints
  getCities: () => api.get("/cities/"),
  createCity: (cityData) => api.post("/cities/", cityData),
  deleteCity: (cityId) => api.delete(`/cities/${cityId}/`),
  getCityWeather: (cityId) => api.get(`/cities/${cityId}/weather/`),
  getCityForecast: (cityId) => api.get(`/cities/${cityId}/forecast/`),

  // Weather data endpoints
  getWeatherData: (cityId = null) => {
    const params = cityId ? { city_id: cityId } : {}
    return api.get("/weather/", { params })
  },

  // Forecast data endpoints
  getForecastData: (cityId = null) => {
    const params = cityId ? { city_id: cityId } : {}
    return api.get("/forecast/", { params })
  },

  // User preferences endpoints
  getPreferences: () => api.get("/preferences/"),
  updatePreferences: (preferences) => api.post("/preferences/", preferences),
  addFavoriteCity: (cityId) => api.post("/preferences/add_favorite_city/", { city_id: cityId }),
  removeFavoriteCity: (cityId) => api.post("/preferences/remove_favorite_city/", { city_id: cityId }),
}

export default api
