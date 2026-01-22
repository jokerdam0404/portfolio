import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance Portfolio | Your Name",
  description: "Personal portfolio showcasing my finance journey, projects, and experience in investment banking, financial modeling, and quantitative analysis.",
  keywords: ["finance", "investment banking", "portfolio", "financial modeling", "valuation"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Finance Portfolio | Your Name",
    description: "Personal portfolio showcasing my finance journey",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
