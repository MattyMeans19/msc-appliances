import BusinessHeader from "@/components/business-header";

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
