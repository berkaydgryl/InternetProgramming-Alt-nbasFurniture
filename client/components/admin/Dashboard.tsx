import { useAdmin } from "./AdminContext";
import { LayoutGrid, Layers, PlusCircle, Package, Star, Settings } from "lucide-react";

interface DashboardProps {
  navItems: { id: string; label: string; icon: any; count?: number }[];
  setActiveSection: (s: string) => void;
}

export default function Dashboard({ navItems, setActiveSection }: DashboardProps) {
  const { products, sidebarCategories, heroSection } = useAdmin();
  const activeCount = products.filter((p) => p.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-border">
        {[
          { label: "Total Products", value: String(products.length).padStart(2, "0"), sub: `${activeCount} active · ${products.length - activeCount} inactive`, colored: true },
          { label: "Categories", value: String(sidebarCategories.length).padStart(2, "0"), sub: "Categories menu" },
          { label: "Hero Image", value: heroSection.image ? "✓" : "—", sub: heroSection.title || "No title" },
        ].map((s, i) => (
          <div key={i} className="p-5 sm:p-6 bg-card border-b sm:border-b-0 sm:border-r border-border last:border-b-0 last:border-r-0 relative group">
            <div className="absolute top-0 left-0 w-0.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-fast" />
            <div className="text-tag uppercase text-muted-foreground mb-3">{s.label}</div>
            <div className="font-mono text-h3 font-medium text-foreground leading-none mb-2">{s.value}</div>
            <div className="text-caption text-muted-foreground">
              {"colored" in s ? <><span className="text-green-700">{activeCount} active</span> · <span className="text-destructive">{products.length - activeCount} inactive</span></> : s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-3">
        {navItems.slice(1).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className="flex items-center gap-4 p-4 sm:p-5 bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all duration-fast text-left group">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-body-sm font-medium text-foreground">{label}</span>
            <span className="ml-auto text-border group-hover:text-primary transition-colors duration-fast text-body-lg">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
