"use client"

import { useState, useEffect } from "react"
import { Calendar, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { weatherAPI } from "@/lib/api"

export default function ForecastCard({ city }) {
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchForecast()
  }, [city.id])

  const fetchForecast = async (retryCount = 0) => {
    try {
      setLoading(true)
      setError(null)
      const response = await weatherAPI.getCityForecast(city.id)
      setForecast(response.data)
    } catch (err) {
      console.error("Forecast fetch error:", err)
      
      // Retry logic for timeout errors
      if (err.code === 'ECONNABORTED' && retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff: 1s, 2s
        console.log(`Retrying forecast fetch in ${delay}ms... (attempt ${retryCount + 1})`)
        setTimeout(() => fetchForecast(retryCount + 1), delay)
        return
      }
      
      // Handle different error types
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.")
      } else if (err.response?.status === 404) {
        setError("Forecast data not found for this city.")
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Failed to fetch forecast data. Please check your connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded animate-pulse">
                <div className="h-4 bg-muted-foreground/20 rounded w-20"></div>
                <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => fetchForecast()}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          5-Day Forecast - {city.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-sm font-medium min-w-[80px]">{formatDate(day.forecast_date)}</div>
                <img
                  src={getWeatherIcon(day.weather_icon) || "/placeholder.svg"}
                  alt={day.weather_description}
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs">
                    {day.weather_main}
                  </Badge>
                  <div className="text-xs text-muted-foreground capitalize mt-1">{day.weather_description}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="font-medium">{Math.round(day.temperature_max)}°</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-blue-500" />
                  <span className="text-muted-foreground">{Math.round(day.temperature_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
