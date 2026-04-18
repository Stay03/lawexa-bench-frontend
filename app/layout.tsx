import { Fraunces, Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        fontDisplay.variable,
        "font-sans",
      )}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
