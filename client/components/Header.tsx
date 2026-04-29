import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { trackWhatsAppClick } from "@/lib/analytics";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/koleksiyonlar", label: "Categories", accordion: true },
  { to: "/hakkimizda", label: "About" },
  { to: "/iletisim", label: "Contact" },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoTilt, setLogoTilt] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const { data: catalog } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetch("/api/catalog").then((res) => res.json()),
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  const sidebarCategories: string[] = catalog?.sidebarCategories || [];
  const mainWhatsapp = settings?.whatsappNumber || "905358712233";

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const triggerLogoTilt = () => {
    setLogoTilt(true);
    setTimeout(() => setLogoTilt(false), 400);
  };

  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    triggerLogoTilt();
    handleNavClick("/")(e);
  };

  const LogoBlock = () => (
    <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-sm overflow-hidden shadow-lg flex-shrink-0 transition-transform duration-base ease-out ${logoTilt ? "rotate-12" : "rotate-0"}`}>
        <LazyImage src="/logo.svg" alt="Altınbaş Furniture" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col">
        <span className="font-serif font-bold text-sub sm:text-h4 text-foreground leading-none">
          Altınbaş Furniture
        </span>
        <span className="text-label sm:text-tag uppercase text-primary font-bold mt-0.5 sm:mt-1">
          Accessories • Manufacturer
        </span>
      </div>
    </Link>
  );

  // Close the menu when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      {/* Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-sm focus:text-body font-bold">
        Skip to Content
      </a>
      <header className={`sticky top-0 z-header w-full border-b border-border transition-colors duration-fast ${
        menuOpen ? "bg-card" : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}>
        <div className="px-gutter sm:px-gutter-md lg:px-gutter-lg xl:px-gutter-xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors duration-fast"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <LogoBlock />
            </div>

            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleNavClick(to)}
                  aria-current={location.pathname === to ? "page" : undefined}
                  className={`text-body font-medium transition-colors duration-fast ${
                    location.pathname === to ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-overlay md:hidden">
          <div className="absolute inset-0 bg-card" />
          <div className="relative z-10 flex flex-col h-full">
            {/* Top bar */}
            <div className="flex items-center gap-2 h-16 sm:h-20 px-gutter sm:px-gutter-md border-b border-border flex-shrink-0">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors duration-fast"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <LogoBlock />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto pt-2 pb-8 px-gutter-md">
              <nav aria-label="Mobile Navigation" className="flex flex-col">
                {navLinks.map(({ to, label, accordion }) => {
                  const isActive = location.pathname === to;

                  // Categories — accordion
                  if (accordion) {
                    return (
                      <div key={to}>
                        <button
                          onClick={() => setCatOpen(!catOpen)}
                          aria-expanded={catOpen}
                          aria-controls="mobile-categories"
                          className={`flex items-center justify-between w-full px-4 py-5 text-sub font-medium border-b border-surface-warm-4 transition-colors duration-fast ${
                            isActive || catOpen ? "text-primary" : "text-foreground"
                          }`}
                        >
                          <span>{label}</span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-base ${catOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Accordion content */}
                        <div
                          id="mobile-categories"
                          role="region"
                          className="overflow-hidden transition-[max-height] duration-base ease-out"
                          style={{ maxHeight: catOpen ? "300px" : "0px" }}
                        >
                          <div className="max-h-[300px] overflow-y-auto bg-surface-warm-2 border-b border-surface-warm-4">
                            {sidebarCategories.length > 0 ? (
                              sidebarCategories.map((cat, i) => (
                                <Link
                                  key={cat}
                                  to={`/koleksiyonlar?kategori=${encodeURIComponent(cat)}`}
                                  onClick={() => setMenuOpen(false)}
                                  className={`flex items-center pl-8 pr-4 py-3.5 text-body-sm text-muted-foreground hover:text-primary transition-colors duration-fast ${
                                    i < sidebarCategories.length - 1 ? "border-b border-surface-warm-4/60" : ""
                                  }`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-primary/40 mr-3 flex-shrink-0" />
                                  {cat}
                                </Link>
                              ))
                            ) : (
                              <p className="pl-8 pr-4 py-3.5 text-body-sm text-muted-foreground/60 italic">
                                No categories yet
                              </p>
                            )}

                            {/* Link to all categories */}
                            <Link
                              to="/koleksiyonlar"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center pl-8 pr-4 py-3.5 text-body-sm text-primary font-semibold border-t border-surface-warm-4"
                            >
                              All Categories →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Normal link
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={handleNavClick(to)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center px-4 py-5 text-sub font-medium border-b border-surface-warm-4 transition-colors duration-fast ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom WhatsApp */}
            <div className="flex-shrink-0 px-gutter-md pb-8">
              <a
                href={`https://wa.me/${mainWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("mobile_menu")}
                aria-label="Contact us on WhatsApp (opens in a new window)"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-whatsapp text-white font-bold rounded-sm text-body"
              >
                Contact us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
