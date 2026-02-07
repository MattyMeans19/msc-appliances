import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/CartContext";
import { LoadingProvider } from "@/context/LoadingContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">
              {children}
            </main>
            <Footer />
        </div>
        </CartProvider>
    </LoadingProvider>
  );
}
