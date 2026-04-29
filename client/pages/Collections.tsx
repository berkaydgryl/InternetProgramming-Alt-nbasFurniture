import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import Header from "@/components/Header";
import { createSlug } from "@/lib/utils";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/lib/seo";
import { trackCategoryView } from "@/lib/analytics";

interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  images: string[];
  isActive?: boolean;
}

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);

  const { data: catalog, isLoading, isError } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetch("/api/catalog").then((res) => { if (!res.ok) throw new Error("API error"); return res.json(); }),
  });

  const sidebarCategories: string[] = catalog?.sidebarCategories || [];
  const products: Product[] = catalog?.products || [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kategori = params.get("kategori");
    if (kategori && sidebarCategories.includes(kategori)) {
      setActiveCategory(kategori);
    }
  }, [location.search, sidebarCategories]);

  useEffect(() => {
    if (!tabsRef.current || !activeCategory) return;
    const activeBtn = tabsRef.current.querySelector("[data-active='true']") as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  const currentCategory = activeCategory || sidebarCategories[0] || null;
  const filteredProducts = products.filter((p) => p.category === currentCategory && p.isActive !== false);

  // Send event when category changes
  useEffect(() => {
    if (currentCategory) trackCategoryView(currentCategory, filteredProducts.length);
  }, [currentCategory, filteredProducts.length]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Collections | {SITE_NAME}</title>
        <meta name="description" content="Custom-designed nesting tables, dressers, mirrors, and armchairs. Discover all our collections." />
        <link rel="canonical" href={`${SITE_URL}/koleksiyonlar`} />
        <meta property="og:title" content={`Collections | ${SITE_NAME}`} />
        <meta property="og:description" content="Custom-designed nesting tables, dressers, mirrors, and armchairs." />
        <meta property="og:url" content={`${SITE_URL}/koleksiyonlar`} />
        <meta property="og:image" content={`${SITE_URL}${OG_IMAGE}`} />
        {currentCategory && filteredProducts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${currentCategory} | ${SITE_NAME}`,
              description: `Discover all our products in the ${currentCategory} category.`,
              url: `${SITE_URL}/koleksiyonlar?kategori=${encodeURIComponent(currentCategory)}`,
              isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: filteredProducts.length,
                itemListElement: filteredProducts.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: p.name,
                  url: `${SITE_URL}/urun/${createSlug(p.category)}/${createSlug(p.name)}`,
                  ...(p.images[0] ? { image: p.images[0] } : {}),
                })),
              },
            })}
          </script>
        )}
      </Helmet>
      <Header />

      {/* Underline Tab Bar */}
      <div className="bg-card sticky top-16 sm:top-20 z-tabs border-b border-border">
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div ref={tabsRef} role="tablist" aria-label="Product categories" className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-px">
            {sidebarCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={currentCategory === cat}
                data-active={currentCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative whitespace-nowrap px-4 sm:px-5 py-3 sm:py-3.5 text-2xs sm:text-body tracking-wide transition-colors duration-fast ${
                  currentCategory === cat
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                {cat}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-base ${
                    currentCategory === cat ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg py-6 sm:py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-40">
              <h2 className="text-tag uppercase text-muted-foreground font-semibold mb-4">
                Categories
              </h2>
              <nav className="space-y-0.5">
                {isLoading ? (
                  <div aria-label="Loading categories" className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded-sm animate-pulse" />
                    ))}
                  </div>
                ) : isError ? (
                  <p className="text-body text-destructive py-4">Categories could not be loaded. Please refresh the page.</p>
                ) : sidebarCategories.length === 0 ? (
                  <p className="text-body text-muted-foreground py-4">No categories have been added yet.</p>
                ) : (
                  sidebarCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-body rounded-sm transition-all duration-fast group ${
                        currentCategory === cat
                          ? "bg-primary/10 text-primary border-l-[3px] border-primary font-semibold"
                          : "text-foreground hover:bg-muted/60 border-l-[3px] border-transparent hover:border-primary/20 font-medium"
                      }`}
                    >
                      <span>{cat}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-fast ${
                          currentCategory === cat
                            ? "text-primary translate-x-0"
                            : "text-muted-foreground -translate-x-1 group-hover:translate-x-0"
                        }`}
                      />
                    </button>
                  ))
                )}
              </nav>
            </div>
          </aside>

          {/* Right Content Area */}
          <main id="main-content" role="tabpanel" aria-label={currentCategory || "Products"} className="flex-1 min-w-0">
            {currentCategory ? (
              <>
                <div className="mb-6 sm:mb-8">
                  <h1 className="font-serif text-h3 font-bold text-foreground">
                    {currentCategory}
                  </h1>
                  <div className="w-8 sm:w-14 h-px sm:h-[2px] bg-primary/60 mt-2.5 sm:mt-3" />
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-section-md text-center">
                    <span className="text-5xl mb-4 opacity-30">📦</span>
                    <p className="text-body-lg text-muted-foreground">No products have been added to this category yet.</p>
                    <p className="text-2xs text-muted-foreground mt-1">You can add products from the admin panel.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/urun/${createSlug(product.category)}/${createSlug(product.name)}`}
                        className="group overflow-hidden hover:shadow-md transition-all duration-base rounded-sm border border-border/80"
                      >
                        <div className="aspect-[4/5] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          {product.images.length > 0 ? (
                            <LazyImage
                              src={product.images[0]}
                              alt={product.name}
                                                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-3xl sm:text-4xl opacity-20">🖼️</span>
                            </div>
                          )}
                        </div>
                        <div className="px-2.5 py-3 sm:px-4 sm:py-4">
                          <h3 className="text-2xs sm:text-body text-foreground/90 group-hover:text-primary transition-colors duration-fast line-clamp-2 leading-relaxed font-medium">
                            {product.name || "Unnamed Product"}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-section-lg text-center">
                <span className="text-5xl sm:text-6xl mb-4">🛋️</span>
                <h2 className="font-serif text-h3 font-bold text-foreground mb-2">Our Categories</h2>
                <p className="text-body text-muted-foreground max-w-md">
                  {sidebarCategories.length === 0
                    ? "No categories have been added yet. You can add categories from the admin panel."
                    : "Select a category from the left menu to view products."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
