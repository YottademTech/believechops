import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL } from "@/lib/site";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    const href = `${SITE_URL}${location.pathname}${location.search}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [location.pathname, location.search]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster richColors position="top-center" />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
