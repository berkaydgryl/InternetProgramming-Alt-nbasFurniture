import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { GripVertical, Pencil, Check, X, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product } from "./types";
import { Image } from "lucide-react";

// ─── Section Wrapper ──────────────────────────────────────
export function Section({ title, count, action, children }: { title: string; count?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-body-lg font-semibold text-foreground tracking-wide">{title}</h2>
          {count && <span className="font-mono text-caption text-muted-foreground">{count}</span>}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

// ─── Field Wrapper ────────────────────────────────────────
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-tag uppercase text-muted-foreground font-semibold block">{label}</label>
      {children}
    </div>
  );
}

// ─── Save Button ──────────────────────────────────────────
export function SaveButton({ saving, onClick, label }: { saving: boolean; onClick: () => void; label: string }) {
  return (
    <div className="flex justify-end pb-8 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 -mx-1 px-1 sm:static sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0">
      <button type="button" disabled={saving} onClick={onClick}
        className="inline-flex items-center gap-2 px-8 h-9 bg-primary hover:bg-primary/85 text-primary-foreground text-body-sm font-medium tracking-wide disabled:opacity-50 transition-colors duration-fast">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        {saving ? "Saving..." : label}
      </button>
    </div>
  );
}

// ─── Sortable Category Item ───────────────────────────────
interface SortableCategoryItemProps {
  cat: string; index: number; isEditing: boolean; editValue: string;
  onEditValueChange: (v: string) => void; onStartEdit: () => void;
  onSaveEdit: () => void; onCancelEdit: () => void; onRemove: () => void;
}
export function SortableCategoryItem({ cat, index, isEditing, editValue, onEditValueChange, onStartEdit, onSaveEdit, onCancelEdit, onRemove }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : undefined };
  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between px-4 py-3 border-b border-border bg-card hover:bg-background transition-colors duration-fast last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground touch-none p-2">
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="w-5 h-5 bg-muted text-muted-foreground flex items-center justify-center text-2xs font-bold flex-shrink-0">{index + 1}</span>
        {isEditing ? (
          <Input value={editValue} onChange={(e) => onEditValueChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSaveEdit(); if (e.key === "Escape") onCancelEdit(); }}
            className="h-7 text-body-sm flex-1 rounded-none border-border" autoFocus />
        ) : (
          <span className="font-medium text-body-sm text-foreground truncate">{cat}</span>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={onSaveEdit} className="h-9 w-9 text-green-700 hover:bg-green-700/10 rounded-none">
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit} className="h-9 w-9 rounded-none">
              <X className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={onStartEdit} className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-none">
              <Pencil className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-none">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

// ─── Sortable Featured Product Item ──────────────────────
export function SortableFeaturedItem({ product, onRemove }: { product: Product; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : undefined };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors duration-fast">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground touch-none p-2 flex-shrink-0">
        <GripVertical className="w-4 h-4" />
      </button>
      {product.images[0] ? (
        <LazyImage src={product.images[0]} alt="" className="w-10 h-10 object-cover border border-border flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center flex-shrink-0">
          <Image className="w-4 h-4 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-foreground truncate">{product.name}</p>
        <p className="text-2xs text-muted-foreground">{product.category}</p>
      </div>
      <button onClick={onRemove} className="text-destructive hover:text-destructive/80 p-2 transition-colors duration-fast flex-shrink-0" title="Remove">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
