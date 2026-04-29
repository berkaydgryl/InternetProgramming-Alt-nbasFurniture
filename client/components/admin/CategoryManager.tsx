import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAdmin } from "./AdminContext";
import { Section, SortableCategoryItem } from "./shared";

export default function CategoryManager() {
  const { sidebarCategories, setSidebarCategories, setProducts, whatsappNumbers, setCategoryWhatsapp, saving, handleSave, markDirty } = useAdmin();
  const [newSidebarCategory, _setNewSidebarCategory] = useState("");
  const setNewSidebarCategory = (v: string) => { if (v) markDirty(); _setNewSidebarCategory(v); };
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  const addSidebarCategory = () => {
    const t = newSidebarCategory.trim();
    if (!t) return;
    if (sidebarCategories.includes(t)) { toast.error("This category already exists."); return; }
    setSidebarCategories((p) => [...p, t]);
    // Auto-assign main WhatsApp number to new category
    const mainNum = whatsappNumbers.find((n) => n.isMain);
    if (mainNum) setCategoryWhatsapp((prev) => [...prev, { category: t, numberId: mainNum.id }]);
    setNewSidebarCategory("");
    toast.success(`"${t}" added.`);
  };

  const removeSidebarCategory = (name: string) => {
    setSidebarCategories((p) => p.filter((c) => c !== name));
    setCategoryWhatsapp((prev) => prev.filter((c) => c.category !== name));
  };

  const startEditCategory = (cat: string) => { setEditingCategory(cat); setEditingCategoryValue(cat); };

  const saveEditCategory = () => {
    if (!editingCategory) return;
    const t = editingCategoryValue.trim();
    if (!t) { toast.error("Cannot be empty."); return; }
    if (t !== editingCategory && sidebarCategories.includes(t)) { toast.error("This name already exists."); return; }
    setSidebarCategories((p) => p.map((c) => (c === editingCategory ? t : c)));
    setProducts((p) => p.map((pr) => (pr.category === editingCategory ? { ...pr, category: t } : pr)));
    setCategoryWhatsapp((prev) => prev.map((c) => c.category === editingCategory ? { ...c, category: t } : c));
    toast.success(`"${editingCategory}" → "${t}"`);
    setEditingCategory(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSidebarCategories((items) => arrayMove(items, items.indexOf(active.id as string), items.indexOf(over.id as string)));
      toast.info("Order changed. Don't forget to save.");
    }
  }, [setSidebarCategories]);

  return (
    <div className="max-w-4xl space-y-6">
      <Section title="Categories" count={`${sidebarCategories.length} categories`}
        action={
          <div className="flex gap-2">
            <Input value={newSidebarCategory} onChange={(e) => setNewSidebarCategory(e.target.value)}
              placeholder="New category..." onKeyDown={(e) => e.key === "Enter" && addSidebarCategory()}
              className="h-8 text-body-sm rounded-none border-border w-36 sm:w-48 focus-visible:ring-0 focus:border-primary" />
            <Button onClick={addSidebarCategory} size="sm"
              className="rounded-none bg-secondary hover:bg-secondary/90 text-secondary-foreground h-8 px-4 gap-1 transition-colors duration-fast">
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
        }>
        {sidebarCategories.length === 0 ? (
          <p className="text-body-sm text-muted-foreground text-center py-8">No categories added yet.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sidebarCategories} strategy={verticalListSortingStrategy}>
              <ul className="border border-border">
                {sidebarCategories.map((cat, i) => (
                  <SortableCategoryItem key={cat} cat={cat} index={i}
                    isEditing={editingCategory === cat} editValue={editingCategoryValue}
                    onEditValueChange={setEditingCategoryValue}
                    onStartEdit={() => startEditCategory(cat)}
                    onSaveEdit={saveEditCategory}
                    onCancelEdit={() => setEditingCategory(null)}
                    onRemove={() => removeSidebarCategory(cat)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave()}
          className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Categories"}
        </button>
      </div>
    </div>
  );
}
