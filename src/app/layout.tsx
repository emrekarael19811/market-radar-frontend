import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Co-Founder - Fiyat Karşılaştırma",
  description: "Marketlerdeki en uygun fiyatları anında bulun.",
};

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          <Navbar />
          {/* Navbar 56px yüksekliğinde — içerik onun altında başlasın */}
          <div style={{ paddingTop: '56px' }}>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
