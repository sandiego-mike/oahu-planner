import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { DataProvider } from "@/components/DataProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Oahu Family Vacation Planner",
  description: "A shared itinerary, suggestions, map, food guide, and memory wall for the Oahu family trip.",
  openGraph: {
    title: "Oahu Family Vacation Planner",
    description: "Ko Olina home base, early mornings, beaches, trails, food, and family memories.",
    images: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Aerial%20view%20of%20Disneys%20Aulani%20resort%20and%20Ko%20Olina%20Lagoon.jpg?width=1400"
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <DataProvider>
          <Navbar />
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
