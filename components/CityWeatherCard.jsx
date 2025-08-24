"use client"

import { useState, useEffect } from "react"
import { Trash2, Heart, HeartOff, Thermometer, Droplets, Wind, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { weatherAPI } from "@/lib/api"

export default function CityWeatherCard({ city, onRemoveCity, onToggleFavorite, isFavorite }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWeather()
  }, [city.id])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await weatherAPI.getCityWeather(city.id)
      setWeather(response.data)
    } catch (err) {
      setError("Failed to fetch weather data")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            {city.name}, {city.country_code}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchWeather} variant="outline" size="sm" className="mt-2 bg-transparent">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {city.name}, {city.country_code}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(city.id)}
              className="text-muted-foreground hover:text-primary"
            >
              {isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <HeartOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveCity(city.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {weather && (
          <div className="space-y-4">
            {/* Main weather display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getWeatherIcon(weather.weather_icon) || "/placeholder.svg"}
                  alt={weather.weather_description}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-3xl font-bold text-primary">{Math.round(weather.temperature)}°C</div>
                  <div className="text-sm text-muted-foreground">Feels like {Math.round(weather.feels_like)}°C</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  {weather.weather_main}
                </Badge>
                <div className="text-sm text-muted-foreground capitalize">{weather.weather_description}</div>
              </div>
            </div>

            {/* Weather details */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <span className="font-medium">{weather.humidity}%</span>
                  <span className="text-muted-foreground ml-1">humidity</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-medium">{weather.wind_speed} m/s</span>
                  <span className="text-muted-foreground ml-1">wind</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  <span className="font-medium">{weather.pressure} hPa</span>
                  <span className="text-muted-foreground ml-1">pressure</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  <span className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</span>
                  <span className="text-muted-foreground ml-1">visibility</span>
                </span>
              </div>
            </div>

            {/* UV Index */}
            {weather.uv_index !== null && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">UV Index</span>
                <Badge variant={weather.uv_index > 6 ? "destructive" : weather.uv_index > 3 ? "default" : "secondary"}>
                  {weather.uv_index}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
