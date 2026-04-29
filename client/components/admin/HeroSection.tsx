import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { Save, Image, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { Section, Field } from "./shared";
import { createSlug } from "@/lib/utils";

export default function HeroSection() {
  const { products, heroSection, setHeroSection, saving, handleSave, handleHeroImageUpload } = useAdmin();
  const [productSearch, setProductSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeProducts = useMemo(() => products.filter((p) => p.isActive !== false), [products]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return activeProducts;
    const q = productSearch.toLowerCase();
    return activeProducts.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [activeProducts, productSearch]);

  const selectProduct = (product: typeof activeProducts[0]) => {
    setHeroSection((prev) => ({
      ...prev,
      title: product.name,
      description: product.description,
      image: product.images[0] || prev.image,
      link: `/urun/${createSlug(product.category)}/${createSlug(product.name)}`,
    }));
    setShowDropdown(false);
    setProductSearch("");
    toast.success(`"${product.name}" selected.`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Section title="Featured Product">
        <div className="space-y-4">
          {/* Product selector */}
          <Field label="Select Product">
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={(e) => { setShowDropdown(true); setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300); }}
                  placeholder="Search by product name or category..."
                  inputMode="search" enterKeyHint="search" autoComplete="off"
                  className="pl-9 rounded-none border-border focus-visible:ring-0 focus:border-primary"
                />
                {productSearch && (
                  <button onClick={() => { setProductSearch(""); setShowDropdown(false); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {showDropdown && (
                <div className="absolute z-header bottom-full left-0 right-0 mb-1 border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="text-body-sm text-muted-foreground text-center py-4">No products found.</p>
                  ) : (
                    filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectProduct(p)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-background transition-colors duration-fast text-left border-b border-border last:border-b-0"
                      >
                        {p.images[0] ? (
                          <LazyImage src={p.images[0]} alt="" className="w-8 h-8 object-cover border border-border flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center flex-shrink-0">
                            <Image className="w-3 h-3 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-foreground truncate">{p.name}</p>
                          <p className="text-2xs text-muted-foreground">{p.category}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </Field>

          <Field label="Tag">
            <Input value={heroSection.tag} onChange={(e) => setHeroSection((p) => ({ ...p, tag: e.target.value }))}
              placeholder="Piece of the Week" enterKeyHint="done" autoComplete="off"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
              className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
          </Field>
          <Field label="Title">
            <Input value={heroSection.title} onChange={(e) => setHeroSection((p) => ({ ...p, title: e.target.value }))}
              placeholder="Sapphire Blue Dresser" enterKeyHint="done" autoComplete="off"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
              className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
          </Field>
          <Field label="Description">
            <Input value={heroSection.description} onChange={(e) => setHeroSection((p) => ({ ...p, description: e.target.value }))}
              placeholder="Crafted with custom lacquer paint and brass details." enterKeyHint="done" autoComplete="off"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
              className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
          </Field>
          <Field label="Image">
            <div className="flex gap-2">
              <Input value={heroSection.image} onChange={(e) => setHeroSection((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://..." inputMode="url" enterKeyHint="done"
                className="rounded-none border-border flex-1 focus-visible:ring-0" />
              <div className="relative flex-shrink-0">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleHeroImageUpload} />
                <Button type="button" variant="outline" className="pointer-events-none rounded-none border-border gap-1 text-caption h-9">
                  <Image className="w-3.5 h-3.5" /> Choose
                </Button>
              </div>
            </div>
          </Field>
          {heroSection.image && (
            <div className="relative h-48 overflow-hidden border border-border">
              <LazyImage src={heroSection.image} alt={heroSection.title} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 text-white pointer-events-none">
                <p className="text-tag uppercase tracking-widest text-primary font-bold">{heroSection.tag}</p>
                <p className="font-serif text-sub font-semibold">{heroSection.title}</p>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave()}
          className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Featured Product"}
        </button>
      </div>
    </div>
  );
}
