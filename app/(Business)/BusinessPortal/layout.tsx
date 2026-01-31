import BusinessHeader from "@/components/business-header";
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grow flex flex-col h-screen">
      <BusinessHeader />
      <main className="grow">
        {children}
      </main>
    </div>
  );
}
