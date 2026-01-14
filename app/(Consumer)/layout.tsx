import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const spline = Spline_Sans({
  variable: "--font-spline-sans",
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
        className={`${spline.variable} antialiased flex flex-col max-w-screen h-screen`}
        style={{ fontFamily: 'var(--font-spline-sans)' }}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
