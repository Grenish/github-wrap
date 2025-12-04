import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
      <body className={`${space.className} antialiased`}>
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="c8e55daa-a555-4f8a-9a22-baef339a92e9"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
