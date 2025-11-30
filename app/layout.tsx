import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Wrap 2025",
  description:
    "Discover your 2025 GitHub stats, contributions, top repos, and coding trends in a personalized year-in-review summary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${space.className} antialiased`}>{children}</body>
    </html>
  );
}
