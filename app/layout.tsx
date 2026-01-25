import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comico - Create Your Comic Book",
  description: "Transform your photos and stories into beautiful comic books powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
