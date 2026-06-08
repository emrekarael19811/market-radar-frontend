import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Co-Founder - Fiyat Karşılaştırma",
  description: "Marketlerdeki en uygun fiyatları anında bulun.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
