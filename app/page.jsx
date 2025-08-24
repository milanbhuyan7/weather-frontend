"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Settings } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import SearchBar from "@/components/SearchBar"
import CityWeatherCard from "@/components/CityWeatherCard"
import ForecastCard from "@/components/ForecastCard"
import { weatherAPI } from "@/lib/api"

export default function WeatherDashboard() {
  const [cities, setCities] = useState([])
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingCity, setAddingCity] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [citiesResponse, preferencesResponse] = await Promise.all([
        weatherAPI.getCities(),
        weatherAPI.getPreferences().catch(() => ({ data: [] })),
      ])

      setCities(citiesResponse.data)
      setPreferences(preferencesResponse.data[0] || null)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
      toast({
        title: "Error",
        description: "Failed to load weather data. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCity = async (cityData) => {
    try {
      setAddingCity(true)
      const response = await weatherAPI.createCity(cityData)
      setCities((prev) => [...prev, response.data])
      toast({
        title: "Success",
        description: `${response.data.name} has been added to your weather dashboard.`,
      })
    } catch (error) {
      console.error("Failed to add city:", error)
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add city. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingCity(false)
    }
  }

  const handleRemoveCity = async (cityId) => {
    try {
      await weatherAPI.deleteCity(cityId)
      setCities((prev) => prev.filter((city) => city.id !== cityId))
      toast({
        title: "Success",
        description: "City has been removed from your dashboard.",
      })
    } catch (error) {
      console.error("Failed to remove city:", error)
      toast({
        title: "Error",
        description: "Failed to remove city. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (cityId) => {
    try {
      const isFavorite = preferences?.favorite_cities?.some((city) => city.id === cityId)

      if (isFavorite) {
        await weatherAPI.removeFavoriteCity(cityId)
        toast({
          title: "Removed from favorites",
          description: "City has been removed from your favorites.",
        })
      } else {
        await weatherAPI.addFavoriteCity(cityId)
        toast({
          title: "Added to favorites",
          description: "City has been added to your favorites.",
        })
      }

      // Refresh preferences
      const preferencesResponse = await weatherAPI.getPreferences()
      setPreferences(preferencesResponse.data[0] || null)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isCityFavorite = (cityId) => {
    return preferences?.favorite_cities?.some((city) => city.id === cityId) || false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Cloud className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Weather Dashboard</h1>
              <p className="text-muted-foreground">Stay updated with current weather and forecasts</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {preferences?.temperature_unit || "C"}°
          </Badge>
        </div>

        {/* Search Bar */}
        <SearchBar onAddCity={handleAddCity} isLoading={addingCity} />

        {/* Favorite Cities */}
        {preferences?.favorite_cities?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Favorite Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preferences.favorite_cities.map((city) => (
                <CityWeatherCard
                  key={`fav-${city.id}`}
                  city={city}
                  onRemoveCity={handleRemoveCity}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Cities */}
        {cities.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-500" />
              All Cities ({cities.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <CityWeatherCard
                  key={city.id}
                  city={city}
                  onRemoveCity={handleRemoveCity}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isCityFavorite(city.id)}
                />
              ))}
            </div>

            {/* Forecast Section */}
            {cities.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">5-Day Forecasts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cities.slice(0, 4).map((city) => (
                    <ForecastCard key={`forecast-${city.id}`} city={city} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Cities Added</CardTitle>
              <p className="text-muted-foreground mb-4">Start by adding a city to see current weather and forecasts.</p>
              <p className="text-sm text-muted-foreground">Use the search bar above to add your first city.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
