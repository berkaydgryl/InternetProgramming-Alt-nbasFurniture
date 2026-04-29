import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { createSlug } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LazyImage } from "@/components/ui/lazy-image";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, OG_IMAGE } from "@/lib/seo";

interface HomepageCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
}

const defaultCategories: HomepageCategory[] = [
  { id: 1, name: "Custom-Designed Coffee Tables", description: "Unmatched craftsmanship in nesting, center, and side tables", icon: "✨", image: "" },
  { id: 2, name: "Luxury Dressers", description: "Palace-like grandeur for your entryways and living rooms", icon: "🏛️", image: "" },
  { id: 3, name: "Classic & Modern Armchairs", description: "Comfort at its most elegant", icon: "🛋️", image: "" },
  { id: 4, name: "Decorative Mirrors", description: "Gold-leaf designs that add depth to your spaces", icon: "🪞", image: "" },
];

const features = [
  {
    title: "100% Manufacturer Guarantee",
    description: "Direct from our workshop in Mahmutbey to your door, with no middlemen.",
    icon: "🏭",
  },
  {
    title: "Master Craftsmanship",
    description: "Every carving and lacquer finish bears the signature of our experienced artisans.",
    icon: "✍️",
  },
  {
    title: "Bespoke Design",
    description: "We craft the furniture of your dreams with custom color, size, and material options.",
    icon: "🎨",
  },
  {
    title: "Fast WhatsApp Support",
    description: "Reach our craftsmen with one tap for pricing and details.",
    icon: "💬",
  },
];

export default function Index() {
  const [heroOpen, setHeroOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  const whatsappNumber = settings?.whatsappNumber || "905358712233";
  const waNumbers = settings?.whatsappNumbers || [];
  const catAssignments = settings?.categoryWhatsapp || [];
  const getWhatsappForCategory = (category: string): string => {
    const assignment = catAssignments.find((c: any) => c.category === category);
    if (assignment) {
      const num = waNumbers.find((n: any) => n.id === assignment.numberId);
      if (num) return num.number;
    }
    const mainNum = waNumbers.find((n: any) => n.isMain);
    return mainNum?.number || whatsappNumber;
  };

  const { data: catalog, isError: catalogError } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetch("/api/catalog").then((res) => { if (!res.ok) throw new Error("API error"); return res.json(); }),
  });

  const categories: HomepageCategory[] = catalog?.homepageCategories?.length
    ? catalog.homepageCategories
    : defaultCategories;

  const heroSection = catalog?.heroSection || {
    tag: "Piece of the Week",
    title: "Sapphire Blue Dresser",
    description: "Crafted with custom lacquer paint and brass detailing.",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
    link: "/koleksiyonlar",
  };

  const allProducts: { id: number; name: string; category: string; description: string; images: string[]; isActive?: boolean; isFeatured?: boolean }[] = catalog?.products || [];
  const featuredProducts = allProducts.filter((p) => p.isFeatured && p.isActive !== false);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{SITE_NAME} | 100% Manufacturer Luxury Furniture and Accessories</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${SITE_NAME} | 100% Manufacturer Luxury Furniture and Accessories`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}${OG_IMAGE}`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE_NAME} | 100% Manufacturer Luxury Furniture and Accessories`} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}${OG_IMAGE}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FurnitureStore",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo.svg`,
          "image": `${SITE_URL}/logo.svg`,
          "description": SITE_DESCRIPTION,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Mahmutbey",
            "addressLocality": "Mahmutbey",
            "addressRegion": "İstanbul",
            "addressCountry": "TR"
          },
          "telephone": "+905358712233",
          "email": "info@altinbasmobilya.com",
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "09:00", "closes": "19:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "00:00", "closes": "00:00" }
          ],
          "priceRange": "₺₺₺",
          "sameAs": []
        })}</script>
      </Helmet>
      <Header />

      {/* Hero Section */}
      <main id="main-content">
      <section aria-label="Hero" className="relative overflow-hidden py-section-sm sm:py-section-md md:py-section-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5" />

        <div className="relative max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-5 sm:space-y-8 animate-in fade-in slide-in-from-left duration-slow">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-caption sm:text-body-sm tracking-widest uppercase">
                  100% Manufacturer
                </div>
                <h1 className="font-serif text-h1 font-bold text-foreground">
                  Where Craft Meets <span className="text-primary italic">Luxury</span>
                </h1>
                <p className="text-body-lg sm:text-sub md:text-h4 text-muted-foreground font-light">
                  Bespoke accessory pieces from our workshop in Mahmutbey, designed to add value to your home.
                </p>
              </div>
              <p className="hidden sm:block text-sub text-muted-foreground leading-relaxed max-w-xl">
                At Altınbaş Furniture Accessories, we blend our generations-old craft tradition with a modern design sensibility. From gold leaf to lacquer, we deliver flawless quality in every piece.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-4">
                <Link
                  to="/koleksiyonlar"
                  className="inline-flex items-center justify-center px-5 sm:px-10 py-2.5 sm:py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:translate-y-[-2px] transition-all duration-base shadow-lg hover:shadow-primary/20 text-body-sm sm:text-body-lg"
                >
                  Browse Categories
                </Link>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center justify-center px-5 sm:px-10 py-2.5 sm:py-4 border-2 border-secondary text-secondary font-bold rounded-sm hover:bg-secondary hover:text-secondary-foreground transition-all duration-base text-body-sm sm:text-body-lg"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Hero Image / Badge */}
            <div className="relative h-hero-sm max-h-[50vh] sm:h-hero-md sm:max-h-none md:h-hero-lg flex items-center justify-center animate-in fade-in zoom-in duration-slow">
              <div className="absolute inset-0 border-2 border-primary/20 translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4 rounded-sm" />
              <div
                role="button"
                tabIndex={0}
                aria-expanded={heroOpen}
                aria-label="Show piece of the week details"
                className="relative w-full h-full bg-secondary overflow-hidden rounded-sm shadow-2xl cursor-pointer"
                onClick={() => setHeroOpen((prev) => !prev)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHeroOpen((prev) => !prev); } }}
              >
                <LazyImage
                  src={heroSection.image}
                  alt={heroSection.title}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:bottom-8 sm:left-8 sm:right-8 sm:p-6 bg-background/95 backdrop-blur shadow-xl border-l-4 border-primary">
                  <p className="text-primary font-bold text-label sm:text-body-sm uppercase tracking-widest mb-0.5 sm:mb-1 italic">{heroSection.tag}</p>
                  <h3 className="font-serif text-body sm:text-h3 font-bold leading-tight">{heroSection.title}</h3>
                  <div className={`grid transition-[grid-template-rows] duration-slow ${heroOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-2xs sm:text-body text-muted-foreground">{heroSection.description}</p>
                        {heroSection.link && (
                          <Link
                            to={heroSection.link}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0 ml-4 text-primary font-bold text-2xs sm:text-body hover:underline whitespace-nowrap"
                          >
                            View Product &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-section-sm sm:py-section-md md:py-section-lg bg-gradient-to-b from-surface-warm-1 to-surface-warm-2">
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="text-center mb-section-sm sm:mb-section-md">
            <h2 className="font-serif text-h2 font-bold text-foreground mb-3 sm:mb-4">
              Categories
            </h2>
            <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-primary mx-auto mb-4 sm:mb-6" />
            <p className="text-body sm:text-sub text-muted-foreground max-w-2xl mx-auto">
              Each one comes alive in skilled hands — exclusive collections that bring soul to your spaces.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/koleksiyonlar?kategori=${encodeURIComponent(category.name)}`}
                className="group relative h-card-sm sm:h-card-md md:h-card-lg overflow-hidden rounded-sm shadow-md hover:shadow-2xl transition-all duration-slow"
              >
                {category.image ? (
                  <LazyImage
                    src={category.image}
                    alt={category.name}
                                       className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-slow"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary group-hover:scale-110 transition-transform duration-slow" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-8 text-white z-10">
                  <span className="text-xl sm:text-3xl block mb-1 sm:mb-2">{category.icon}</span>
                  <h3 className="font-serif text-body-lg sm:text-h4 font-bold leading-tight drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="hidden sm:block text-body-sm text-white/70 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-slow">
                    {category.description}
                  </p>
                  <div className="pt-1.5 sm:pt-3 overflow-hidden h-0 group-hover:h-10 transition-all duration-slow">
                    <span className="inline-block border-b border-primary text-primary text-caption sm:text-body-sm font-bold tracking-widest uppercase pb-0.5">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — Horizontal Scroll */}
      {featuredProducts.length > 0 && (
      <section className="py-section-sm sm:py-section-md md:py-section-lg bg-gradient-to-b from-surface-warm-2 via-surface-warm-3 to-surface-warm-4 relative overflow-hidden">
        {/* Section Header */}
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="flex items-end justify-between mb-section-sm sm:mb-section-md gap-gutter">
            <div>
              <p className="text-label text-primary font-bold uppercase tracking-widest mb-1 sm:mb-2">Collection</p>
              <h2 className="font-serif text-h2 font-bold text-foreground">Featured Products</h2>
            </div>
            <Link to="/koleksiyonlar" className="flex-shrink-0 text-primary font-bold border-b-2 border-primary pb-1 hover:text-primary/70 transition-colors duration-base uppercase text-caption sm:text-body tracking-widest">
              View All
            </Link>
          </div>
        </div>

        {/* Carousel — constrained to same max-w-wide container as categories */}
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg relative">
          {/* Scroll Navigation Arrows */}
          {featuredProducts.length > 3 && (
            <>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -(scrollRef.current?.clientWidth ?? 320) / 3, behavior: "smooth" })}
                className="hidden lg:flex absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 backdrop-blur-sm border border-border items-center justify-center text-foreground hover:bg-card hover:shadow-lg transition-all duration-fast"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: (scrollRef.current?.clientWidth ?? 320) / 3, behavior: "smooth" })}
                className="hidden lg:flex absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 backdrop-blur-sm border border-border items-center justify-center text-foreground hover:bg-card hover:shadow-lg transition-all duration-fast"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Scroll area — bounded by container, cards overflow inside */}
          <div ref={scrollRef} className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
            <div className="flex gap-gutter sm:gap-gutter-md">
            {featuredProducts.map((product) => (
              <div key={product.id} className="snap-start flex-shrink-0 w-3/4 sm:w-2/5 md:w-1/3 lg:w-1/4 group relative bg-card border border-border overflow-hidden rounded-sm hover:shadow-2xl transition-all duration-slow">
                {/* Card Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {product.images[0] ? (
                    <LazyImage src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-4xl">🖼️</div>
                  )}
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-0.5 text-label font-bold uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h3 className="font-serif text-body-lg sm:text-h4 font-bold leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <Link
                      to={`/urun/${createSlug(product.category)}/${createSlug(product.name)}`}
                      className="text-primary font-bold italic tracking-wide font-serif text-body-sm sm:text-body hover:underline"
                    >
                      View Product &rarr;
                    </Link>
                    <a
                      href={`https://wa.me/${getWhatsappForCategory(product.category)}?text=${encodeURIComponent(`Could I get more information about ${product.name}?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary/10 transition-colors duration-fast text-primary"
                    >
                      💬
                    </a>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Features Section */}
      <section className="py-section-sm sm:py-section-md md:py-section-lg bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="text-center mb-section-sm sm:mb-section-md">
            <h2 className="font-serif text-h2 font-bold mb-3 sm:mb-4">
              Why Altınbaş Furniture?
            </h2>
            <p className="text-body sm:text-sub text-secondary-foreground/70 max-w-2xl mx-auto">
              Every piece that leaves our workshop is a hallmark of quality and trust.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-5 sm:p-10 border border-primary/20 bg-card/5 backdrop-blur-sm hover:bg-primary/10 transition-all duration-base rounded-sm group"
              >
                <div className="text-3xl sm:text-5xl mb-3 sm:mb-6 transform group-hover:scale-110 transition-transform duration-base">{feature.icon}</div>
                <h3 className="font-serif text-body sm:text-h4 font-bold mb-2 sm:mb-3 text-primary tracking-wide leading-tight">
                  {feature.title}
                </h3>
                <p className="text-2xs sm:text-body-lg leading-relaxed text-secondary-foreground/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-section-sm sm:py-section-md md:py-section-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/10" />
        <div className="relative max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg text-center">
          <h2 className="font-serif text-h2 font-bold text-foreground mb-4 sm:mb-6">
            Let's Design the Furniture of Your Dreams Together
          </h2>
          <p className="text-body sm:text-sub text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            We craft pieces that are entirely yours, with custom color, size, and material options.
            Visit our workshop or reach out via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I'd like to get information about a custom design.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-4 bg-whatsapp text-white font-bold rounded-sm hover:translate-y-[-2px] transition-all duration-base shadow-lg text-body-sm sm:text-body-lg"
            >
              💬 Reach Us on WhatsApp
            </a>
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-4 border-2 border-primary text-primary font-bold rounded-sm hover:bg-primary hover:text-primary-foreground transition-all duration-base text-body-sm sm:text-body-lg"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="px-gutter sm:px-gutter-md lg:px-gutter-lg xl:px-gutter-xl py-section-sm sm:py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-sm overflow-hidden">
                  <LazyImage src="/logo.svg" alt="Altınbaş Furniture" loading="lazy" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sub leading-none">
                    Altınbaş Furniture
                  </span>
                  <span className="text-tag uppercase text-primary font-bold mt-1">
                    Accessories • Manufacturer
                  </span>
                </div>
              </div>
              <p className="text-secondary-foreground/70 text-body">
                Luxury furniture accessory manufacturing with a 100% manufacturer guarantee.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Pages</h4>
              <ul className="space-y-2 text-body text-secondary-foreground/70">
                <li><Link to="/hakkimizda" className="hover:text-primary transition-colors duration-fast">About Us</Link></li>
                <li><Link to="/koleksiyonlar" className="hover:text-primary transition-colors duration-fast">Categories</Link></li>
                <li><Link to="/iletisim" className="hover:text-primary transition-colors duration-fast">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Our Products</h4>
              <ul className="space-y-2 text-body text-secondary-foreground/70">
                <li>Nesting Tables</li>
                <li>Dressers & Consoles</li>
                <li>Mirrors</li>
                <li>Armchairs & Seating</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-primary">Get in Touch</h4>
              <ul className="space-y-2 text-body text-secondary-foreground/70">
                <li>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-fast">
                    📞 +{whatsappNumber.slice(0,2)} {whatsappNumber.slice(2,5)} {whatsappNumber.slice(5,8)} {whatsappNumber.slice(8,10)} {whatsappNumber.slice(10,12)}
                  </a>
                </li>
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=Mahmutbey+Istanbul" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-fast">
                    📍 Mahmutbey, Istanbul
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/altinbasmobilya/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-fast">
                    📸 @altinbasmobilya
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center text-body text-secondary-foreground/50">
            <p>&copy; {new Date().getFullYear()} Altınbaş Furniture Accessories. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 md:mt-0">
              <a href="https://www.instagram.com/altinbasmobilya/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-fast">Instagram</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-fast">WhatsApp</a>
              <Link to="/iletisim" className="hover:text-primary transition-colors duration-fast">Contact</Link>
              <Link to="/gizlilik-politikasi" className="hover:text-primary transition-colors duration-fast">Privacy</Link>
              <Link to="/hizmet-sartlari" className="hover:text-primary transition-colors duration-fast">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
