import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { LazyImage } from "@/components/ui/lazy-image";
import { Save, Image, X, Pencil, ArrowLeft, Search, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAdmin } from "./AdminContext";
import { Section, Field } from "./shared";
import type { HomepageCategory } from "./types";

// ─── Sortable Showcase Item ─────────────────────────────
function SortableShowcaseItem({ cat, onEdit, onRemove }: { cat: HomepageCategory; onEdit: () => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : undefined };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors duration-fast">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground touch-none flex-shrink-0">
        <GripVertical className="w-4 h-4" />
      </button>
      {cat.image ? (
        <LazyImage src={cat.image} alt="" className="w-10 h-10 object-cover border border-border flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center flex-shrink-0">
          <Image className="w-4 h-4 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {cat.icon && <span className="text-body-lg">{cat.icon}</span>}
          <p className="text-body-sm font-medium text-foreground truncate">{cat.name || <span className="text-destructive italic">Not selected</span>}</p>
        </div>
        {cat.description && <p className="text-2xs text-muted-foreground truncate">{cat.description}</p>}
      </div>
      <button onClick={onEdit} className="text-muted-foreground hover:text-foreground p-1 transition-colors duration-fast flex-shrink-0" title="Edit">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onRemove} className="text-destructive hover:text-destructive/80 p-1 transition-colors duration-fast flex-shrink-0" title="Remove">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CategoryShowcase() {
  const { homepageCategories, setHomepageCategories, sidebarCategories, saving, handleSave, updateHomepageCategory, handleImageUpload } = useAdmin();
  const [editingVitrinId, setEditingVitrinId] = useState<number | null>(null);
  const [catSearch, setCatSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const editingCat = editingVitrinId !== null ? homepageCategories.find((c) => c.id === editingVitrinId) : null;

  // Categories not yet added to showcase
  const availableCategories = useMemo(() => {
    const usedNames = homepageCategories.map((c) => c.name);
    return sidebarCategories.filter((c) => !usedNames.includes(c));
  }, [sidebarCategories, homepageCategories]);

  const filteredAvailable = useMemo(() => {
    if (!catSearch.trim()) return availableCategories;
    const q = catSearch.toLowerCase();
    return availableCategories.filter((c) => c.toLowerCase().includes(q));
  }, [availableCategories, catSearch]);

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

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setHomepageCategories((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, [setHomepageCategories]);

  const addCategory = (name: string) => {
    if (homepageCategories.length >= 4) {
      toast.error("A maximum of 4 categories can be added.");
      return;
    }
    const newId = homepageCategories.length > 0 ? Math.max(...homepageCategories.map((c) => c.id)) + 1 : 1;
    setHomepageCategories((prev) => [...prev, { id: newId, name, description: "", icon: "", image: "" }]);
    setCatSearch("");
    setShowDropdown(false);
    toast.success(`"${name}" added to showcase.`);
  };

  const removeCategory = (id: number) => {
    setHomepageCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category removed. Bring the total back to 4.");
  };

  const canSave = homepageCategories.length === 4;

  // ── Edit View ──
  if (editingCat) {
    return (
      <div className="max-w-4xl space-y-6">
        {/* Edit header */}
        <div className="flex items-center gap-4">
          <button onClick={() => setEditingVitrinId(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-body-sm font-medium transition-colors duration-fast">
            <ArrowLeft className="w-4 h-4" /> Back to Showcase
          </button>
          <div className="h-px flex-1 bg-border" />
          <span className="text-tag uppercase text-muted-foreground">Edit {editingCat.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left col: info */}
          <div className="lg:col-span-3 space-y-5">
            <div className="border border-border bg-card">
              <div className="px-4 sm:px-6 py-4 border-b border-border bg-background">
                <h2 className="font-serif text-body-sm font-semibold text-foreground tracking-wide">Card Information</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <Field label="Category">
                  <Input value={editingCat.name} disabled
                    className="rounded-none border-border bg-muted text-muted-foreground cursor-not-allowed" />
                </Field>
                <Field label="Icon (Emoji)">
                  <Input value={editingCat.icon} onChange={(e) => updateHomepageCategory(editingCat.id, "icon", e.target.value)}
                    placeholder="✨" className="rounded-none border-border focus-visible:ring-0 focus:border-primary" />
                </Field>
              </div>
            </div>
          </div>

          {/* Right col: image */}
          <div className="lg:col-span-2 space-y-5">
            <div className="border border-border bg-card">
              <div className="px-4 sm:px-5 py-4 border-b border-border bg-background flex items-center justify-between">
                <h2 className="font-serif text-body-sm font-semibold text-foreground tracking-wide">Image</h2>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                {/* Upload button */}
                <div className="relative">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleImageUpload(editingCat.id, e)} />
                  <button type="button"
                    className="pointer-events-none w-full h-24 border-2 border-dashed border-border bg-background flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-fast">
                    <Image className="w-5 h-5" />
                    <span className="text-caption tracking-wide font-medium">Add Photo</span>
                  </button>
                </div>

                {/* Image preview */}
                {editingCat.image ? (
                  <div className="relative overflow-hidden border border-border group">
                    <LazyImage src={editingCat.image} alt={editingCat.name} className="w-full h-48 object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-3 text-white text-caption font-medium pointer-events-none">{editingCat.name}</span>
                    <button onClick={() => updateHomepageCategory(editingCat.id, "image", "")}
                      className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-fast">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground text-center py-4">No image yet.</p>
                )}

                {/* URL input */}
                <Field label="or by URL">
                  <Input value={editingCat.image} onChange={(e) => updateHomepageCategory(editingCat.id, "image", e.target.value)}
                    placeholder="https://..." className="rounded-none border-border focus-visible:ring-0" />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Save bar */}
        <div className="flex justify-end pt-2 pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              const ok = await handleSave(); if (ok) setEditingVitrinId(null);
            }}
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
    <div className="max-w-2xl space-y-6">
      <Section title="Homepage Category Showcase" count={`${homepageCategories.length} cards`}>
        <div className="space-y-4">
          {/* Info */}
          <div className="flex items-start gap-3 p-3 border border-primary/30 bg-primary/5 text-body-sm text-muted-foreground">
            <span className="text-primary mt-0.5">i</span>
            <p>Select exactly 4 categories to display on the homepage. Drag to reorder, use the pencil icon to edit details.</p>
          </div>

          {/* Add category search — only show when less than 4 */}
          {homepageCategories.length < 4 && availableCategories.length > 0 && (
            <Field label="Add Category">
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={catSearch}
                    onChange={(e) => { setCatSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={(e) => { setShowDropdown(true); setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300); }}
                    placeholder="Search by category name..."
                    inputMode="search" enterKeyHint="search" autoComplete="off"
                    className="pl-9 rounded-none border-border focus-visible:ring-0 focus:border-primary"
                  />
                  {catSearch && (
                    <button onClick={() => { setCatSearch(""); setShowDropdown(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute z-header bottom-full left-0 right-0 mb-1 border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                    {filteredAvailable.length === 0 ? (
                      <p className="text-body-sm text-muted-foreground text-center py-4">
                        {availableCategories.length === 0 ? "All categories have been added." : "No matching categories."}
                      </p>
                    ) : (
                      filteredAvailable.map((name) => (
                        <button
                          key={name}
                          onClick={() => addCategory(name)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-background transition-colors duration-fast text-left border-b border-border last:border-b-0"
                        >
                          <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-body-sm font-medium text-foreground">{name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Field>
          )}

          {/* Sortable category list */}
          {homepageCategories.length > 0 ? (
            <div className="border border-border divide-y divide-border">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={homepageCategories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {homepageCategories.map((cat) => (
                    <SortableShowcaseItem
                      key={cat.id}
                      cat={cat}
                      onEdit={() => setEditingVitrinId(cat.id)}
                      onRemove={() => removeCategory(cat.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground text-center py-6">No showcase categories selected yet.</p>
          )}

          {/* Validation */}
          {!canSave && homepageCategories.length > 0 && (
            <p className="text-caption text-destructive">
              {`You must select 4 categories (add ${4 - homepageCategories.length} more).`}
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
          {saving ? "Saving..." : "Save Showcase"}
        </button>
      </div>
    </div>
  );
}
