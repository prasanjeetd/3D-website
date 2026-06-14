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
      <head>
        {/* Preload the cleaver textures (the bulk of the model) so they download in
            parallel with the JS engine chunk instead of waiting for it to load first.
            crossOrigin matches three.js TextureLoader (anonymous) so the browser reuses
            the preloaded files instead of re-fetching. */}
        <link rel="preload" as="image" crossOrigin="anonymous" href="/models/cleaver/textures/M_Cleaver_baseColor_1k.webp" />
        <link rel="preload" as="image" crossOrigin="anonymous" href="/models/cleaver/textures/M_Cleaver_metallicRoughness_1k.webp" />
        <link rel="preload" as="image" crossOrigin="anonymous" href="/models/cleaver/textures/M_Cleaver_normal_1k.webp" />
        <link rel="preload" as="fetch" crossOrigin="anonymous" href="/models/cleaver/scene-1k.gltf" />
        <link rel="preload" as="fetch" crossOrigin="anonymous" href="/models/cleaver/scene.bin" />
      </head>
      <body className={`${inter.variable} bg-zinc-950 text-zinc-100 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
