import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PremiumCursor from "@/components/ui/PremiumCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import "./globals.css";

// Premium variable fonts for distinctive brand identity
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Achintya Chaganti | Physics & Economics Student | Equity Analyst",
  description: "Achintya Chaganti - Physics and Economics student at Northeastern University and Michigan State University. Equity Analyst managing a $5M fund, undergraduate researcher, and aspiring finance professional.",
  keywords: ["Achintya Chaganti", "equity research", "financial modeling", "physics", "economics", "quantitative finance", "portfolio management", "DCF valuation"],
  authors: [{ name: "Achintya Chaganti" }],
  openGraph: {
    title: "Achintya Chaganti | Physics & Economics | Equity Analyst",
    description: "Physics and Economics student passionate about equity research and financial modeling",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-[#050505]">
        <ThemeProvider>
          <PremiumCursor />
          <ScrollProgress position="top" height={3} showPercentage={false} />
          <SmoothScroll>
            <Navigation />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
