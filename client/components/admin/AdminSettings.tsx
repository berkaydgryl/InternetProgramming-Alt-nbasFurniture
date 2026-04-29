import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Save, Phone, Plus, X, Crown, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { Section, Field } from "./shared";
import type { WhatsAppNumber } from "./types";

export default function AdminSettings() {
  const { whatsappNumbers, setWhatsappNumbers, categoryWhatsapp, setCategoryWhatsapp, sidebarCategories, saving, handleSave, markDirty } = useAdmin();
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");

  const mainNumber = whatsappNumbers.find((n) => n.isMain);

  const isValidPhone = (val: string) => /^\d{10,15}$/.test(val);

  const addNumber = () => {
    const name = newName.trim();
    const number = newNumber.trim().replace(/\D/g, "");
    if (!name || !number) { toast.error("Name and number are required."); return; }
    if (!isValidPhone(number)) { toast.error("Enter a valid number (10-15 digits, numbers only). Example: 905551112233"); return; }
    if (whatsappNumbers.length >= 6) { toast.error("A maximum of 6 numbers can be added."); return; }
    if (whatsappNumbers.some((n) => n.number === number)) { toast.error("This number is already added."); return; }
    const newId = whatsappNumbers.length > 0 ? Math.max(...whatsappNumbers.map((n) => n.id)) + 1 : 1;
    const isFirst = whatsappNumbers.length === 0;
    setWhatsappNumbers((prev) => [...prev, { id: newId, name, number, isMain: isFirst }]);
    setNewName("");
    setNewNumber("");
    markDirty();
    toast.success(`"${name}" added.`);
  };

  const removeNumber = (id: number) => {
    const target = whatsappNumbers.find((n) => n.id === id);
    if (!target) return;
    if (target.isMain) { toast.error("You cannot delete the main number. Set another number as main first."); return; }
    setWhatsappNumbers((prev) => prev.filter((n) => n.id !== id));
    // Remove category assignments pointing to this number
    setCategoryWhatsapp((prev) => prev.filter((c) => c.numberId !== id));
    markDirty();
    toast.success(`"${target.name}" removed.`);
  };

  const setAsMain = (id: number) => {
    setWhatsappNumbers((prev) => prev.map((n) => ({ ...n, isMain: n.id === id })));
    markDirty();
    toast.success("Main number changed.");
  };

  const startEdit = (n: WhatsAppNumber) => {
    setEditingId(n.id);
    setEditName(n.name);
    setEditNumber(n.number);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const name = editName.trim();
    const number = editNumber.trim().replace(/\D/g, "");
    if (!name || !number) { toast.error("Name and number cannot be empty."); return; }
    if (!isValidPhone(number)) { toast.error("Enter a valid number (10-15 digits, numbers only)."); return; }
    setWhatsappNumbers((prev) => prev.map((n) => n.id === editingId ? { ...n, name, number } : n));
    setEditingId(null);
    markDirty();
  };

  const [assigningNumberId, setAssigningNumberId] = useState<number | null>(null);

  const getCategoriesForNumber = (numberId: number): string[] => {
    return categoryWhatsapp.filter((c) => c.numberId === numberId).map((c) => c.category);
  };

  // Categories not explicitly assigned to any non-main number (they default to main)
  const unassignedCategories = sidebarCategories.filter(
    (cat) => !categoryWhatsapp.some((c) => c.category === cat && c.numberId !== mainNumber?.id)
  );

  const assignCategory = (category: string, numberId: number) => {
    setCategoryWhatsapp((prev) => {
      const filtered = prev.filter((c) => c.category !== category);
      return [...filtered, { category, numberId }];
    });
    markDirty();
  };

  const unassignCategory = (category: string) => {
    setCategoryWhatsapp((prev) => prev.filter((c) => c.category !== category));
    markDirty();
  };

  const getAvailableForAssign = (numberId: number): string[] => {
    // Categories not assigned to this specific number (available to add)
    const alreadyAssigned = getCategoriesForNumber(numberId);
    return sidebarCategories.filter((cat) => !alreadyAssigned.includes(cat));
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* WhatsApp Numbers */}
      <Section title="WhatsApp Numbers" count={`${whatsappNumbers.length} / 6`}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 border border-primary/30 bg-primary/5 text-body-sm text-muted-foreground">
            <span className="text-primary mt-0.5">i</span>
            <p>Add multiple numbers and choose a main number. You can assign different numbers to different categories.</p>
          </div>

          {/* Number list */}
          {whatsappNumbers.length > 0 && (
            <div className="border border-border divide-y divide-border">
              {whatsappNumbers.map((n) => (
                <div key={n.id} className="flex items-center gap-3 px-4 py-3">
                  {editingId === n.id ? (
                    <>
                      <Phone className="w-4 h-4 text-whatsapp flex-shrink-0" />
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                        enterKeyHint="done" autoComplete="off"
                        className="h-8 text-body-sm rounded-none border-border flex-1 focus-visible:ring-0 focus:border-primary" />
                      <Input value={editNumber} onChange={(e) => setEditNumber(e.target.value)}
                        inputMode="tel" enterKeyHint="done" autoComplete="off"
                        className="h-8 text-body-sm font-mono rounded-none border-border w-32 focus-visible:ring-0 focus:border-primary" />
                      <button onClick={saveEdit} className="text-primary hover:text-primary/80 p-2 transition-colors duration-fast flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground p-2 transition-colors duration-fast flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 text-whatsapp flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-body-sm font-medium text-foreground truncate">{n.name}</p>
                          {n.isMain && (
                            <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-primary bg-primary/10 px-1.5 py-0.5">
                              <Crown className="w-2.5 h-2.5" /> Main
                            </span>
                          )}
                        </div>
                        <p className="text-caption font-mono text-muted-foreground">{n.number}</p>
                      </div>
                      {!n.isMain && (
                        <button onClick={() => setAsMain(n.id)} title="Set as main number"
                          className="text-muted-foreground/40 hover:text-primary p-2 transition-colors duration-fast flex-shrink-0">
                          <Crown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => startEdit(n)} title="Edit"
                        className="text-muted-foreground hover:text-foreground p-2 transition-colors duration-fast flex-shrink-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {!n.isMain && (
                        <button onClick={() => removeNumber(n.id)} title="Remove"
                          className="text-destructive hover:text-destructive/80 p-2 transition-colors duration-fast flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add new number */}
          {whatsappNumbers.length < 6 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (e.g. Ahmet)" enterKeyHint="next" autoComplete="off"
                onKeyDown={(e) => e.key === "Enter" && addNumber()}
                onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
                className="h-9 text-body-sm rounded-none border-border flex-1 focus-visible:ring-0 focus:border-primary" />
              <Input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}
                placeholder="905XXXXXXXXX" inputMode="tel" enterKeyHint="done" autoComplete="off"
                onKeyDown={(e) => e.key === "Enter" && addNumber()}
                onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 300)}
                className="h-9 text-body-sm font-mono rounded-none border-border sm:w-40 focus-visible:ring-0 focus:border-primary" />
              <button onClick={addNumber}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-body-sm font-medium transition-colors duration-fast flex-shrink-0">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Category Assignment — number-centric */}
      {whatsappNumbers.length > 1 && sidebarCategories.length > 0 && (
        <Section title="Category Routing">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-primary/30 bg-primary/5 text-body-sm text-muted-foreground">
              <span className="text-primary mt-0.5">i</span>
              <p>Unassigned categories are automatically routed to the main number. Add categories you want routed to a different number to that number.</p>
            </div>

            <div className="space-y-3">
              {whatsappNumbers.map((num) => {
                const assignedCats = getCategoriesForNumber(num.id);
                const isMain = num.isMain;
                const available = getAvailableForAssign(num.id);

                return (
                  <div key={num.id} className="border border-border bg-card">
                    {/* Number header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-background border-b border-border">
                      <Phone className="w-3.5 h-3.5 text-whatsapp flex-shrink-0" />
                      <p className="text-body-sm font-medium text-foreground">{num.name}</p>
                      {isMain && (
                        <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-primary bg-primary/10 px-1.5 py-0.5">
                          <Crown className="w-2.5 h-2.5" /> Main
                        </span>
                      )}
                      <span className="text-caption font-mono text-muted-foreground ml-auto">{num.number}</span>
                    </div>

                    {/* Assigned categories */}
                    <div className="px-4 py-3">
                      {isMain && (
                        <p className="text-caption text-muted-foreground mb-2">All unassigned categories fall here.</p>
                      )}

                      {/* Category chips */}
                      {assignedCats.length > 0 || (isMain && unassignedCategories.length > 0) ? (
                        <div className="flex flex-wrap gap-1.5">
                          {/* Explicitly assigned categories (removable) */}
                          {assignedCats.map((cat) => (
                            <span key={cat} className="inline-flex items-center gap-1 text-2xs font-medium bg-primary/10 text-primary px-2 py-1">
                              {cat}
                              <button onClick={() => unassignCategory(cat)} className="hover:text-destructive transition-colors duration-fast">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {/* Main number: show unassigned categories as passive chips */}
                          {isMain && unassignedCategories.filter((c) => !assignedCats.includes(c)).map((cat) => (
                            <span key={cat} className="inline-flex items-center text-2xs text-muted-foreground bg-muted px-2 py-1">
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        !isMain && <p className="text-caption text-muted-foreground">No categories assigned yet.</p>
                      )}

                      {/* Add category dropdown */}
                      {!isMain && available.length > 0 && (
                        <div className="mt-2">
                          {assigningNumberId === num.id ? (
                            <div className="flex flex-wrap gap-1.5 p-2 border border-dashed border-border bg-background">
                              {available.map((cat) => (
                                <button key={cat} onClick={() => { assignCategory(cat, num.id); }}
                                  className="text-2xs font-medium text-foreground bg-card border border-border px-2 py-1 hover:border-primary hover:text-primary transition-colors duration-fast">
                                  + {cat}
                                </button>
                              ))}
                              <button onClick={() => setAssigningNumberId(null)}
                                className="text-2xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors duration-fast">
                                Close
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setAssigningNumberId(num.id)}
                              className="inline-flex items-center gap-1 text-caption text-primary hover:text-primary/80 font-medium transition-colors duration-fast mt-1">
                              <Plus className="w-3 h-3" /> Add Category
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* Save */}
      <div className="flex justify-end pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
        <button
          type="button"
          disabled={saving || whatsappNumbers.length === 0}
          onClick={() => handleSave()}
          className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
