import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LazyImage } from "@/components/ui/lazy-image";
import { Save, Trash2, Image, X, Star, Search, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { Section, Field } from "./shared";

const ITEMS_PER_PAGE = 8;

export default function ProductEdit() {
  const { products, setProducts, sidebarCategories, saving, handleSave, updateProduct, handleProductImageUpload, removeProductImage, authHeaders } = useAdmin();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    return result.sort((a, b) => (a.isActive === false ? 1 : 0) - (b.isActive === false ? 1 : 0));
  }, [products, categoryFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const removeProduct = async (id: number) => {
    setProducts((p) => p.filter((pr) => pr.id !== id));
    setDeleteConfirm(null);
    setEditingProductId(null);
    toast.success("Product deleted, saving...");
    setTimeout(async () => {
      try {
        await Promise.all([
          fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({}) }),
          fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({}) }),
        ]);
      } catch { /* handled by context */ }
    }, 100);
    handleSave();
  };

  // ── Edit View ──
  if (editingProductId !== null) {
    const product = products.find((p) => p.id === editingProductId);
    if (!product) { setEditingProductId(null); return null; }
    return (
      <div className="max-w-4xl space-y-6">
        {/* Edit header */}
        <div className="flex items-center gap-4">
          <button onClick={() => setEditingProductId(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-body-sm font-medium transition-colors duration-fast">
            <span className="text-body-lg leading-none">&larr;</span> Back to Products
          </button>
          <div className="h-px flex-1 bg-border" />
          <span className="text-tag uppercase text-muted-foreground">Edit Product</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left col: info */}
          <div className="lg:col-span-3 space-y-5">
            <div className="border border-border bg-card">
              <div className="px-4 sm:px-6 py-4 border-b border-border bg-background">
                <h2 className="font-serif text-body-sm font-semibold text-foreground tracking-wide">Basic Information</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <Field label="Product Name">
                  <Input value={product.name} onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                    enterKeyHint="done" autoComplete="off"
                    className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
                </Field>
                <Field label="Category">
                  <select value={product.category} onChange={(e) => updateProduct(product.id, "category", e.target.value)}
                    className="flex h-9 w-full border border-border bg-card px-3 text-body-sm focus:outline-none focus:border-primary">
                    {sidebarCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Description">
                  <textarea value={product.description} onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                    placeholder="Dimensions, materials, production details..."
                    enterKeyHint="done" autoComplete="off"
                    className="w-full min-h-[100px] border border-border bg-card px-3 py-2.5 text-body-sm resize-y focus:outline-none focus:border-primary" />
                </Field>
              </div>
            </div>

            {/* Status */}
            <div className="border border-border bg-card">
              <div className="px-4 sm:px-6 py-4 border-b border-border bg-background">
                <h2 className="font-serif text-body-sm font-semibold text-foreground tracking-wide">Visibility</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-medium text-foreground">Active</p>
                    <p className="text-caption text-muted-foreground mt-0.5">When off, this is hidden from the site.</p>
                  </div>
                  <Switch checked={product.isActive !== false} onCheckedChange={(v) => updateProduct(product.id, "isActive", v)} />
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-sm font-medium text-foreground">Featured Product</p>
                    <p className="text-caption text-muted-foreground mt-0.5">Displayed in the homepage showcase section.</p>
                  </div>
                  <Switch checked={product.isFeatured === true} onCheckedChange={(v) => {
                    const featuredCount = products.filter((p) => p.isFeatured).length;
                    if (v && featuredCount >= 6) { toast.error("A maximum of 6 products can be featured."); return; }
                    updateProduct(product.id, "isFeatured", v);
                  }} />
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="border border-destructive/30 bg-card">
              <div className="px-4 sm:px-6 py-4 border-b border-destructive/30 bg-destructive/5">
                <h2 className="font-serif text-body-sm font-semibold text-destructive tracking-wide">Danger Zone</h2>
              </div>
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {deleteConfirm === product.id ? (
                  <>
                    <p className="text-body-sm text-destructive font-medium">Are you sure you want to delete?</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setDeleteConfirm(null)}
                        className="rounded-none border border-border h-8 text-caption px-4">
                        Cancel
                      </Button>
                      <Button variant="ghost" onClick={() => removeProduct(product.id)}
                        className="rounded-none border border-destructive/30 text-destructive-foreground bg-destructive hover:bg-destructive/90 gap-2 h-8 text-caption px-4">
                        <Trash2 className="w-3.5 h-3.5" /> Yes, Delete
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-body-sm text-muted-foreground">Permanently delete this product.</p>
                    <Button variant="ghost" onClick={() => setDeleteConfirm(product.id)}
                      className="rounded-none border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2 h-8 text-caption px-4 transition-colors duration-fast">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Product
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right col: images */}
          <div className="lg:col-span-2 space-y-5">
            <div className="border border-border bg-card">
              <div className="px-4 sm:px-5 py-4 border-b border-border bg-background flex items-center justify-between">
                <h2 className="font-serif text-body-sm font-semibold text-foreground tracking-wide">Photos</h2>
                <span className="font-mono text-caption text-muted-foreground">{product.images.length} item{product.images.length === 1 ? "" : "s"}</span>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                {/* Upload button */}
                <div className="relative">
                  <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleProductImageUpload(product.id, e)} />
                  <button type="button"
                    className="pointer-events-none w-full h-24 border-2 border-dashed border-border bg-background flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-fast">
                    <Image className="w-5 h-5" />
                    <span className="text-caption tracking-wide font-medium">Add Photo</span>
                  </button>
                </div>

                {/* Image grid */}
                {product.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((img, imgI) => (
                      <div key={imgI} className="relative aspect-square overflow-hidden border border-border group">
                        <LazyImage src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeProductImage(product.id, imgI)}
                          className="absolute top-1 right-1 w-7 h-7 bg-destructive text-destructive-foreground flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-fast">
                          <X className="w-3 h-3" />
                        </button>
                        {imgI === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-label text-center py-0.5 font-bold tracking-wider">COVER</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {product.images.length === 0 && (
                  <p className="text-caption text-muted-foreground text-center py-4">No photos yet.</p>
                )}

                <p className="text-2xs text-muted-foreground leading-relaxed">
                  The first photo is shown as the cover.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save bar */}
        <div className="flex justify-end pt-2 pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
          <button
            type="button"
            disabled={saving}
            onClick={async () => { const ok = await handleSave(); if (ok) setEditingProductId(null); }}
            className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="max-w-4xl space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            inputMode="search" enterKeyHint="search" autoComplete="off"
            onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
            className="pl-9 rounded-none border-border focus-visible:ring-0 focus:border-primary h-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="h-9 border border-border bg-card px-3 text-body-sm focus:outline-none focus:border-primary sm:min-w-[180px]"
        >
          <option value="">All Categories</option>
          {sidebarCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Section title="Existing Products" count={`${filteredProducts.length} / ${products.length} records`}>
        {filteredProducts.length === 0 ? (
          <p className="text-body-sm text-muted-foreground text-center py-8">
            {products.length === 0 ? "No products added yet." : "No products match your search."}
          </p>
        ) : (
          <div className="-mx-4 sm:-mx-6 -mb-4 sm:-mb-6">
            {/* Mobile: card list with header */}
            <div className="sm:hidden">
              {/* Header row */}
              <div className="grid grid-cols-[44px_1fr_48px_48px_48px_20px] items-end gap-2 px-4 py-1.5 border-b border-border bg-background">
                <span />
                <span className="text-2xs uppercase text-muted-foreground font-semibold">Product</span>
                <span className="text-2xs uppercase text-muted-foreground font-semibold text-center leading-tight">Image<br />Count</span>
                <span className="text-2xs uppercase text-muted-foreground font-semibold text-center leading-tight">Featured</span>
                <span className="text-2xs uppercase text-muted-foreground font-semibold text-center leading-tight">Stock<br />Status</span>
                <span />
              </div>
              {/* Product rows */}
              <div className="divide-y divide-border">
                {paginatedProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setEditingProductId(product.id)}
                    className="w-full grid grid-cols-[44px_1fr_48px_48px_48px_20px] items-center gap-2 px-4 py-3 hover:bg-background transition-colors duration-fast text-left"
                  >
                    {product.images.length > 0 ? (
                      <img src={product.images[0]} alt="" className={`w-11 h-11 object-cover border border-border ${product.isActive === false ? "opacity-40 grayscale" : ""}`} />
                    ) : (
                      <div className="w-11 h-11 bg-muted border border-border flex items-center justify-center">
                        <Image className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className={`text-body-sm font-medium truncate ${product.isActive === false ? "text-muted-foreground/40 line-through" : "text-foreground"}`}>{product.name}</p>
                      <p className="text-caption text-muted-foreground truncate mt-0.5">{product.category}</p>
                    </div>
                    <span className="text-center text-caption text-muted-foreground">{product.images.length}</span>
                    <span className="flex justify-center">
                      {product.isFeatured ? <Star className="w-3.5 h-3.5 text-primary fill-current" /> : <Star className="w-3.5 h-3.5 text-muted-foreground/20" />}
                    </span>
                    <span className="flex justify-center">
                      <span className={`w-2 h-2 rounded-full ${product.isActive !== false ? "bg-green-700" : "bg-muted-foreground/40"}`} />
                    </span>
                    <span className="flex justify-center">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left text-label uppercase tracking-widest text-muted-foreground font-semibold px-6 py-3 w-14"></th>
                  <th className="text-left text-label uppercase tracking-widest text-muted-foreground font-semibold px-4 py-3">Product</th>
                  <th className="text-left text-label uppercase tracking-widest text-muted-foreground font-semibold px-4 py-3">Category</th>
                  <th className="text-center text-label uppercase tracking-widest text-muted-foreground font-semibold px-4 py-3 whitespace-nowrap">Showcase</th>
                  <th className="text-left text-label uppercase tracking-widest text-muted-foreground font-semibold px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-background transition-colors duration-fast last:border-b-0">
                    <td className="px-6 py-3">
                      {product.images.length > 0 ? (
                        <LazyImage src={product.images[0]} alt="" className={`w-10 h-10 object-cover border border-border ${product.isActive === false ? "opacity-40 grayscale" : ""}`} />
                      ) : (
                        <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center text-muted-foreground/40">
                          <Image className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-body-sm font-medium ${product.isActive === false ? "text-muted-foreground/40 line-through" : "text-foreground"}`}>{product.name}</p>
                      <p className="text-caption text-muted-foreground mt-0.5">{product.images.length} image{product.images.length === 1 ? "" : "s"}</p>
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground">{product.category || <span className="text-destructive">&mdash;</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`transition-colors duration-fast ${product.isFeatured ? "text-primary drop-shadow-sm" : "text-muted-foreground/30"}`}>
                        <Star className={`w-5 h-5 inline ${product.isFeatured ? "fill-current" : ""}`} />
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-widest px-2.5 py-1 ${product.isActive !== false ? "text-green-700 bg-green-700/10" : "text-muted-foreground bg-muted"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive !== false ? "bg-green-700" : "bg-muted-foreground/40"}`} />
                        {product.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditingProductId(product.id)}
                        className="text-caption text-muted-foreground hover:text-foreground border border-border hover:border-primary px-4 py-1.5 transition-all duration-fast whitespace-nowrap">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="p-2.5 border border-border bg-card hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-fast"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 text-body-sm font-medium border transition-colors duration-fast ${
                page === safePage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-background text-muted-foreground"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="p-2.5 border border-border bg-card hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-fast"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
