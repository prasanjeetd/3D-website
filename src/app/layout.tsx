import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Cleaver Pro | Master Craftsmanship",
  description: "Experience the ultimate professional cleaver, forged from premium carbon steel with an ergonomic hardwood handle. Precision crafted for culinary excellence.",
  keywords: ["cleaver", "kitchen knife", "professional knife", "carbon steel", "chef knife"],
  authors: [{ name: "Cleaver Pro" }],
  openGraph: {
    title: "Cleaver Pro | Master Craftsmanship",
    description: "Experience the ultimate professional cleaver, forged from premium carbon steel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} bg-zinc-950 text-zinc-100 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
