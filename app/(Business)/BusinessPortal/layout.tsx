import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import BusinessHeader from "@/components/business-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MSC Appliances",
  description: "The best source for used, reconditioned Appliance sales in the Albuquerque Metro and Rio Rancho area. Locally owned and operated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col max-w-screen h-screen`}
      >
        <BusinessHeader />
        {children}
      </body>
    </html>
  );
}