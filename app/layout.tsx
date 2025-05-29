import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocalUserProvider } from "@/lib/local-user-context";
import IframeDetector from "@/app/components/IframeDetector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Video Analyzer",
  description: "Extract and analyze content from YouTube videos with AI",
  other: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': 'frame-ancestors *;',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalUserProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <IframeDetector>
            {children}
          </IframeDetector>
        </body>
      </html>
    </LocalUserProvider>
  );
}
