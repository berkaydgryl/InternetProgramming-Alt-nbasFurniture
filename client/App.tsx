import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import WhatsAppButton from "@/components/WhatsAppButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { ConsentProvider } from "@/lib/consent";

// Homepage must load fast — static import
import Index from "./pages/Index";

// Other pages are lazy-loaded
const Collections = lazy(() => import("./pages/Collections"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // Don't refetch for 5 minutes
      refetchOnWindowFocus: false,  // Don't refetch when tab regains focus
    },
  },
});

const ScrollToTop = (): null => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <ConsentProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
        <Analytics />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/koleksiyonlar" element={<Collections />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
            <Route path="/hizmet-sartlari" element={<TermsOfService />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/urun/:categorySlug/:productSlug" element={<ProductDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
        <WhatsAppButton />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
    </ConsentProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
