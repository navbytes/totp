import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

const inter = Exo_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Totp Generator",
  description: "TOTP generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
