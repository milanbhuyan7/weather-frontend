import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

export const metadata = {
  title: "Weather Dashboard",
  description: "Modern weather dashboard with current conditions and 5-day forecasts",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
