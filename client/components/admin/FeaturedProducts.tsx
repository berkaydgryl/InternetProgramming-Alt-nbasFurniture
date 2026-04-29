import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { LazyImage } from "@/components/ui/lazy-image";
import { Save, Search, X, Image } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAdmin } from "./AdminContext";
import { Section, Field, SortableFeaturedItem } from "./shared";

export default function FeaturedProducts() {
  const { products, setProducts, saving, handleSave } = useAdmin();
  const [productSearch, setProductSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const featuredProducts = useMemo(() => products.filter((p) => p.isFeatured), [products]);
  const activeNonFeatured = useMemo(
    () => products.filter((p) => p.isActive !== false && !p.isFeatured),
    [products]
  );

  const filteredForAdd = useMemo(() => {
    if (!productSearch.trim()) return activeNonFeatured;
    const q = productSearch.toLowerCase();
    return activeNonFeatured.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [activeNonFeatured, productSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const featuredIds = featuredProducts.map((p) => p.id);
    const oldIndex = featuredIds.indexOf(active.id as number);
    const newIndex = featuredIds.indexOf(over.id as number);
    const reordered = arrayMove(featuredIds, oldIndex, newIndex);

    const unfeatured = products.filter((p) => !p.isFeatured);
    const reorderedFeatured = reordered.map((id) => products.find((p) => p.id === id)!);
    setProducts([...reorderedFeatured, ...unfeatured]);
  };

  const addFeatured = (productId: number) => {
    if (featuredProducts.length >= 6) {
      toast.error("A maximum of 6 products can be featured.");
      return;
    }
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isFeatured: true } : p));
    setProductSearch("");
    setShowDropdown(false);
    toast.success("Product added to featured.");
  };

  const removeFeatured = (productId: number) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isFeatured: false } : p));
    toast.success("Product removed from featured.");
  };

  const canSave = featuredProducts.length >= 1 && featuredProducts.length <= 6;

  return (
    <div className="max-w-2xl space-y-6">
      <Section title="Featured Products" count={`${featuredProducts.length} / 6`}>
        <div className="space-y-4">
          {/* Info */}
          <div className="flex items-start gap-3 p-3 border border-primary/30 bg-primary/5 text-body-sm text-muted-foreground">
            <span className="text-primary mt-0.5">i</span>
            <p>Select 1–6 products to display on the homepage. Use the handle to reorder.</p>
          </div>

          {/* Add product search */}
          {featuredProducts.length < 6 && (
            <Field label="Add Product">
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
                    {filteredForAdd.length === 0 ? (
                      <p className="text-body-sm text-muted-foreground text-center py-4">
                        {activeNonFeatured.length === 0 ? "No products left to add." : "No products found."}
                      </p>
                    ) : (
                      filteredForAdd.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addFeatured(p.id)}
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
          )}

          {/* Featured list with drag-and-drop */}
          {featuredProducts.length > 0 ? (
            <div className="border border-border divide-y divide-border">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={featuredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {featuredProducts.map((product) => (
                    <SortableFeaturedItem key={product.id} product={product} onRemove={() => removeFeatured(product.id)} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground text-center py-6">No featured products selected yet.</p>
          )}

          {/* Validation message */}
          {featuredProducts.length === 0 && (
            <p className="text-caption text-destructive">
              You must select at least 1 product.
            </p>
          )}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
        <button
          type="button"
          disabled={saving || !canSave}
          onClick={() => handleSave()}
          className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Featured"}
        </button>
      </div>
    </div>
  );
}
