import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import "./globals.css";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
