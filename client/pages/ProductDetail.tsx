import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import Header from "@/components/Header";
import { createSlug } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { trackProductView, trackGalleryInteraction, trackWhatsAppClick } from "@/lib/analytics";

interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  images: string[];
  isActive?: boolean;
}

export default function ProductDetail() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data: catalog, isLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => fetch("/api/catalog").then((res) => res.json()),
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  // Category-specific WhatsApp number, fallback to main
  const waNumbers = settings?.whatsappNumbers || [];
  const catAssignments = settings?.categoryWhatsapp || [];
  const getWhatsappForCategory = (category: string): string => {
    const assignment = catAssignments.find((c: any) => c.category === category);
    if (assignment) {
      const num = waNumbers.find((n: any) => n.id === assignment.numberId);
      if (num) return num.number;
    }
    const mainNum = waNumbers.find((n: any) => n.isMain);
    return mainNum?.number || settings?.whatsappNumber || "905358712233";
  };
  const products: Product[] = catalog?.products || [];
  const product = products.find(
    (p) => p.isActive !== false && createSlug(p.category) === categorySlug && createSlug(p.name) === productSlug
  );

  const productUrl = product ? `${SITE_URL}/urun/${createSlug(product.category)}/${createSlug(product.name)}` : "";
  const whatsappMessage = encodeURIComponent(
    `Hello, could I please find out the price of this product?\n\nProduct: ${product?.name || ""}\nLink: ${productUrl}`
  );

  // Product view event
  useEffect(() => {
    if (product) trackProductView(product.name, product.category);
  }, [product?.name, product?.category]);

  const nextImage = () => {
    if (!product) return;
    const next = (activeImage + 1) % product.images.length;
    setActiveImage(next);
    trackGalleryInteraction(product.name, next, "next");
  };

  const prevImage = () => {
    if (!product) return;
    const prev = (activeImage - 1 + product.images.length) % product.images.length;
    setActiveImage(prev);
    trackGalleryInteraction(product.name, prev, "prev");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-section-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg py-section-sm text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h1 className="font-serif text-h3 font-bold mb-2">Product Not Found</h1>
          <p className="text-body text-muted-foreground mb-6">The product you are looking for does not exist or may have been removed.</p>
          <Link to="/koleksiyonlar" className="text-body text-primary font-bold hover:underline">&larr; Back to Categories</Link>
        </div>
      </div>
    );
  }

  const ogImage = product.images[0] || `${SITE_URL}/logo.svg`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.name} — {product.category} | {SITE_NAME}</title>
        <meta name="description" content={product.description || `${product.name} — custom-designed furniture in the ${product.category} category.`} />
        <link rel="canonical" href={`${SITE_URL}/urun/${createSlug(product.category)}/${createSlug(product.name)}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} | ${SITE_NAME}`} />
        <meta property="og:description" content={product.description || `${product.name} — ${product.category}`} />
        <meta property="og:url" content={`${SITE_URL}/urun/${createSlug(product.category)}/${createSlug(product.name)}`} />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description || `${product.name} — ${product.category}`,
          "image": product.images,
          "category": product.category,
          "brand": { "@type": "Brand", "name": SITE_NAME },
          "offers": {
            "@type": "Offer",
            "availability": product.isActive !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": { "@type": "Organization", "name": SITE_NAME }
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": product.category, "item": `${SITE_URL}/koleksiyonlar?kategori=${encodeURIComponent(product.category)}` },
            { "@type": "ListItem", "position": 3, "name": product.name }
          ]
        })}</script>
      </Helmet>
      <Header />

      <main id="main-content">
      <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg pt-gutter pb-section-sm">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-2xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors duration-fast">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/koleksiyonlar?kategori=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors duration-fast">{product.category}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Product Title */}
        <h1 className="font-serif text-h3 font-bold text-foreground mt-gutter mb-gutter">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg sm:gap-section-sm">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <>
                {/* Main Image */}
                <div role="region" aria-label="Product image gallery" className="relative aspect-square bg-card border border-border rounded-sm overflow-hidden shadow-sm">
                  <LazyImage
                    src={product.images[activeImage]}
                    alt={`${product.name} - ${product.category} image ${activeImage + 1}`}
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-full object-contain"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors duration-fast"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors duration-fast"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div aria-live="polite" aria-atomic="true" className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-2xs px-3 py-1 rounded-full">
                        {activeImage + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => { setActiveImage(index); trackGalleryInteraction(product.name, index, "thumbnail"); }}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={activeImage === index ? "true" : undefined}
                        className={`w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-fast ${
                          activeImage === index
                            ? "border-primary shadow-md"
                            : "border-border opacity-60 hover:opacity-100"
                        }`}
                      >
                        <LazyImage src={img} alt={`${product.name} - Image ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-muted flex items-center justify-center rounded-sm border border-border">
                <span className="text-6xl opacity-20">🖼️</span>
              </div>
            )}
          </div>

          {/* Right: Product Information */}
          <div className="space-y-6">
            {product.description && (
              <div>
                <h2 className="font-serif text-sub font-bold text-foreground mb-2">Product Details</h2>
                <div className="bg-surface-warm-2 border border-border rounded-lg p-5 sm:p-6">
                  <p className="text-body text-muted-foreground whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp Ask for Price Button */}
            <div className="pt-4 border-t border-border">
              <Button asChild className="w-full gap-3 text-body-lg py-6 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-base">
                <a
                  href={`https://wa.me/${getWhatsappForCategory(product.category)}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("product_detail", product.name)}
                  aria-label="Ask for the price on WhatsApp (opens in a new window)"
                >
                  <MessageCircle className="w-6 h-6" />
                  Ask for Price on WhatsApp
                </a>
              </Button>
              <p className="text-caption text-muted-foreground text-center mt-2">
                Reach us directly via WhatsApp to learn the price and details of this product.
              </p>
            </div>

          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
