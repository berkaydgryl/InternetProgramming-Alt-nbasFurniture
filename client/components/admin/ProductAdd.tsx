import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LazyImage } from "@/components/ui/lazy-image";
import { Plus, Image, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { Section, Field } from "./shared";

export default function ProductAdd() {
  const { products, setProducts, sidebarCategories, handleSave, markDirty, authHeaders } = useAdmin();
  const [newProduct, _setNewProduct] = useState<{ category: string; name: string; description: string; images: string[] }>({ category: "", name: "", description: "", images: [] });

  const setNewProduct: typeof _setNewProduct = (v) => { markDirty(); _setNewProduct(v); };

  const handleNewProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData(); fd.append("image", files[i]);
      try {
        const r = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd });
        if (r.ok) { const d = await r.json(); setNewProduct((p) => ({ ...p, images: [...p.images, d.url] })); }
      } catch { /* silent */ }
    }
    toast.success("Images uploaded.");
  };

  const removeNewProductImage = (index: number) =>
    setNewProduct((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));

  const uploadProduct = (): boolean => {
    if (!newProduct.name.trim()) { toast.error("Product name cannot be empty."); return false; }
    if (!newProduct.category) { toast.error("Please select a category."); return false; }
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts((p) => [...p, { ...newProduct, id: newId, name: newProduct.name.trim() }]);
    _setNewProduct({ category: "", name: "", description: "", images: [] });
    toast.success(`"${newProduct.name.trim()}" added.`);
    return true;
  };

  return (
    <div className="max-w-4xl">
      <Section title="Add New Product">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name *">
              <Input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                placeholder="Gold Leaf Mirror" enterKeyHint="done" autoComplete="off"
                onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
                className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
            </Field>
            <Field label="Category *">
              <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                className="flex h-9 w-full border border-border bg-card px-3 py-1 text-body-sm focus:outline-none focus:border-primary">
                <option value="">-- Select --</option>
                {sidebarCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
              placeholder="Dimensions, materials, details..." autoComplete="off"
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
              className="w-full min-h-[80px] border border-border bg-card px-3 py-2 text-body-sm resize-y focus:outline-none focus:border-primary" />
          </Field>
          <Field label={`Photos (${newProduct.images.length} item${newProduct.images.length === 1 ? "" : "s"})`}>
            <div className="relative">
              <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleNewProductImageUpload} />
              <button type="button"
                className="pointer-events-none w-full h-12 border-2 border-dashed border-border bg-background flex items-center justify-center gap-2 text-muted-foreground font-medium text-body-sm">
                <Image className="w-4 h-4" /> Add Photos (Multiple Selection)
              </button>
            </div>
            {newProduct.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newProduct.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 overflow-hidden border border-border group">
                    <LazyImage src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeNewProductImage(i)}
                      className="absolute top-0.5 right-0.5 w-7 h-7 bg-destructive text-destructive-foreground flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-fast">
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-label text-center py-0.5 font-bold">COVER</span>}
                  </div>
                ))}
              </div>
            )}
          </Field>
          <div className="flex justify-end pt-2">
            <Button onClick={() => { if (uploadProduct()) handleSave(); }}
              className="rounded-none bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 px-8 transition-colors duration-fast">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
