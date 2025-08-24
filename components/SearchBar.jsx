"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SearchBar({ onAddCity, isLoading }) {
  const [cityName, setCityName] = useState("")
  const [countryCode, setCountryCode] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cityName.trim() && countryCode.trim()) {
      await onAddCity({ name: cityName.trim(), country_code: countryCode.trim().toUpperCase() })
      setCityName("")
      setCountryCode("")
    }
  }

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter city name..."
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <div className="sm:w-32">
          <Input
            type="text"
            placeholder="Country (US)"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            maxLength={2}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} className="sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add City
        </Button>
      </form>
    </Card>
  )
}
