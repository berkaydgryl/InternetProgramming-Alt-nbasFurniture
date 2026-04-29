import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LayoutGrid, Star, Package, Settings, LogOut, Home, PlusCircle, Layers, Sparkles, AlertTriangle, Menu, X } from "lucide-react";
import { toast } from "sonner";

import type { Product, HomepageCategory, HeroSection, WhatsAppNumber, CategoryWhatsApp } from "@/components/admin/types";
import { defaultHero } from "@/components/admin/types";
import { AdminContext } from "@/components/admin/AdminContext";

import Dashboard from "@/components/admin/Dashboard";
import ProductAdd from "@/components/admin/ProductAdd";
import ProductEdit from "@/components/admin/ProductEdit";
import FeaturedProducts from "@/components/admin/FeaturedProducts";
import HeroSectionPanel from "@/components/admin/HeroSection";
import CategoryManager from "@/components/admin/CategoryManager";
import CategoryShowcase from "@/components/admin/CategoryShowcase";
import AdminSettings from "@/components/admin/AdminSettings";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showPrice, setShowPrice] = useState(false);
  const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumber[]>([{ id: 1, name: "Main Number", number: "905358712233", isMain: true }]);
  const [categoryWhatsapp, setCategoryWhatsapp] = useState<CategoryWhatsApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroSection, setHeroSection] = useState<HeroSection>(defaultHero);
  const [homepageCategories, setHomepageCategories] = useState<HomepageCategory[]>([]);
  const [sidebarCategories, setSidebarCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // ─── Unsaved Changes Guard ────────────────────────────
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saveCounter, setSaveCounter] = useState(0);
  const snapshotRef = useRef<string>("");
  const markDirty = useCallback(() => setIsDirty(true), []);

  const hasUnsavedChanges = useCallback(() => {
    if (!snapshotRef.current) return false;
    return JSON.stringify({ products, sidebarCategories, homepageCategories, heroSection, showPrice, whatsappNumbers, categoryWhatsapp }) !== snapshotRef.current;
  }, [products, sidebarCategories, homepageCategories, heroSection, showPrice, whatsappNumbers, categoryWhatsapp]);

  const restoreSnapshot = useCallback(() => {
    if (!snapshotRef.current) return;
    const snap = JSON.parse(snapshotRef.current);
    setProducts(snap.products);
    setSidebarCategories(snap.sidebarCategories);
    setHomepageCategories(snap.homepageCategories);
    setHeroSection(snap.heroSection);
    setShowPrice(snap.showPrice);
    setWhatsappNumbers(snap.whatsappNumbers);
    setCategoryWhatsapp(snap.categoryWhatsapp);
  }, []);

  const navigateTo = (sectionId: string) => {
    if (sectionId === activeSection) { setSidebarOpen(false); return; }
    if (hasUnsavedChanges() || isDirty) {
      setPendingSection(sectionId);
    } else {
      setActiveSection(sectionId);
      setSidebarOpen(false);
    }
  };

  const confirmDiscard = () => {
    if (!pendingSection) return;
    restoreSnapshot();
    setIsDirty(false);
    setActiveSection(pendingSection);
    setPendingSection(null);
    setSidebarOpen(false);
  };

  const cancelDiscard = () => {
    setPendingSection(null);
  };

  // Fetch CSRF token after login
  const fetchCsrfToken = async () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;
    try {
      const r = await fetch("/api/csrf-token", { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        const data = await r.json();
        sessionStorage.setItem("csrfToken", data.csrfToken);
      }
    } catch { /* If CSRF cannot be retrieved, continue silently */ }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    // Refresh the CSRF token when the page is reloaded
    fetchCsrfToken();
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/catalog").then((r) => r.json()),
    ]).then(([s, c]) => {
      setShowPrice(s.showPrice);
      // WhatsApp data: prefer settings response, fallback to catalog
      const waNumbers = s.whatsappNumbers?.length ? s.whatsappNumbers : c.whatsappNumbers;
      if (waNumbers?.length) setWhatsappNumbers(waNumbers);
      const catWa = s.categoryWhatsapp?.length ? s.categoryWhatsapp : c.categoryWhatsapp;
      if (catWa?.length) setCategoryWhatsapp(catWa);
      if (c.heroSection) setHeroSection({ ...defaultHero, ...c.heroSection });
      setHomepageCategories(c.homepageCategories || []);
      setSidebarCategories(c.sidebarCategories || []);
      setProducts(c.products || []);
      setLoading(false);
    }).catch(() => { toast.error("Failed to load data."); setLoading(false); });
  }, [isAuthenticated]);

  // Take snapshot after data loads, section change, or successful save
  useEffect(() => {
    if (!loading) {
      snapshotRef.current = JSON.stringify({ products, sidebarCategories, homepageCategories, heroSection, showPrice, whatsappNumbers, categoryWhatsapp });
      setIsDirty(false);
    }
  }, [loading, activeSection, saveCounter]);

  const authHeaders = (): HeadersInit => {
    const token = sessionStorage.getItem("adminToken");
    const csrf = sessionStorage.getItem("csrfToken");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (csrf) headers["x-csrf-token"] = csrf;
    return headers;
  };

  const handleSave = async (): Promise<boolean> => {
    setSaving(true);
    try {
      const [sr, cr] = await Promise.all([
        fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ showPrice, whatsappNumbers, categoryWhatsapp }) }),
        fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ heroSection, homepageCategories, sidebarCategories, products, whatsappNumbers, categoryWhatsapp }) }),
      ]);
      if (sr.ok && cr.ok) { toast.success("Changes saved."); setSaveCounter((c) => c + 1); return true; }
      if (sr.status === 401 || cr.status === 401 || sr.status === 403 || cr.status === 403) { toast.error("Your session has expired, please log in again."); sessionStorage.clear(); setIsAuthenticated(false); return false; }
      throw new Error();
    } catch { toast.error("Save error."); return false; }
    finally { setSaving(false); }
  };

  const updateHomepageCategory = (id: number, field: keyof HomepageCategory, value: string) =>
    setHomepageCategories((p) => p.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const updateProduct = (id: number, field: keyof Product, value: string | string[] | boolean) =>
    setProducts((p) => p.map((pr) => (pr.id === id ? { ...pr, [field]: value } : pr)));

  const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("image", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd });
      if (r.ok) { updateHomepageCategory(id, "image", (await r.json()).url); toast.success("Image uploaded."); }
      else if (r.status === 401) { toast.error("Your session has expired."); sessionStorage.clear(); setIsAuthenticated(false); }
      else toast.error("Upload failed.");
    } catch { toast.error("Error."); }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("image", file);
    try {
      const r = await fetch("/api/upload?type=hero", { method: "POST", headers: authHeaders(), body: fd });
      if (r.ok) { const d = await r.json(); setHeroSection((p) => ({ ...p, image: d.url })); toast.success("Uploaded."); }
      else toast.error("Upload failed.");
    } catch { toast.error("Error."); }
  };

  const handleProductImageUpload = async (productId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    let success = 0;
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData(); fd.append("image", files[i]);
      try {
        const r = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd });
        if (r.ok) {
          const d = await r.json();
          setProducts((p) => p.map((pr) => pr.id === productId ? { ...pr, images: [...pr.images, d.url] } : pr));
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
    if (failed === 0) {
      toast.success(`${success} image(s) uploaded.`);
    } else if (success > 0) {
      toast.warning(`${success} image(s) uploaded, ${failed} failed.`);
    } else {
      toast.error("Images could not be uploaded. Please try again.");
    }
  };

  const removeProductImage = (productId: number, imageIndex: number) =>
    setProducts((p) => p.map((pr) => pr.id === productId ? { ...pr, images: pr.images.filter((_, i) => i !== imageIndex) } : pr));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginLoading(true);
    try {
      const r = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (r.ok) {
        const data = await r.json();
        sessionStorage.setItem("adminToken", data.token);
        await fetchCsrfToken();
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        toast.success("Login successful.");
      }
      else toast.error("Incorrect password!");
    } catch { toast.error("Could not connect to the server."); }
    finally { setLoginLoading(false); }
  };

  // ─── Login Screen ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-gutter">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-primary text-tag uppercase tracking-widest mb-2">Accessories &middot; Manufacturer</div>
            <h1 className="font-serif text-h3 text-secondary-foreground font-semibold">Altınbaş Furniture</h1>
            <p className="text-muted-foreground text-body-sm mt-1 tracking-wide">Admin Panel</p>
          </div>
          <div className="border border-white/10 bg-secondary/80">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-caption uppercase text-muted-foreground">Login Required</span>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-tag uppercase text-muted-foreground block">Password</label>
                  <Input
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoFocus required
                    className="rounded-none border-white/10 bg-secondary text-secondary-foreground placeholder:text-muted-foreground/40 focus:border-primary focus-visible:ring-0"
                  />
                </div>
                <Button type="submit" disabled={loginLoading}
                  className="w-full rounded-none bg-primary hover:bg-primary/85 text-primary-foreground font-medium tracking-wide text-body-sm h-10 transition-colors duration-fast">
                  {loginLoading ? "Verifying..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Link to="/" className="text-caption text-muted-foreground hover:text-primary transition-colors duration-fast tracking-wide">
                  &larr; Back to Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-caption uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  // ─── Nav Items ────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "kategoriler", label: "Categories", icon: Layers, count: sidebarCategories.length },
    { id: "urun-ekle", label: "Add Product", icon: PlusCircle },
    { id: "urun-duzenle", label: "Edit Product", icon: Package, count: products.length },
    { id: "one-cikan", label: "Featured", icon: Sparkles },
    { id: "vitrin", label: "Category Showcase", icon: LayoutGrid },
    { id: "hero", label: "Featured Item", icon: Star },
    { id: "ayarlar", label: "Settings", icon: Settings },
  ];

  const contextValue = {
    products, setProducts,
    sidebarCategories, setSidebarCategories,
    homepageCategories, setHomepageCategories,
    heroSection, setHeroSection,
    showPrice, setShowPrice,
    whatsappNumbers, setWhatsappNumbers,
    categoryWhatsapp, setCategoryWhatsapp,
    saving, handleSave,
    updateProduct, updateHomepageCategory,
    handleImageUpload, handleHeroImageUpload,
    handleProductImageUpload, removeProductImage,
    markDirty, authHeaders,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* ─── Mobile Sidebar Overlay ─── */}
        <div
          className={`fixed inset-0 bg-black/50 z-tabs lg:hidden transition-opacity duration-base ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ─── Sidebar ──────────────────────────────────── */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-header w-[260px] lg:w-[220px] bg-secondary flex flex-col flex-shrink-0 transition-transform duration-base lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="px-6 py-7 border-b border-secondary-foreground/5 flex items-start justify-between">
            <div>
              <div className="text-primary text-label uppercase tracking-widest mb-1">Accessories &middot; Manufacturer</div>
              <div className="font-serif text-secondary-foreground text-h4 font-semibold leading-tight">
                Altınbaş<br />Furniture
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-secondary-foreground/40 hover:text-secondary-foreground mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 py-4">
            <div className="text-label uppercase text-secondary-foreground/25 px-6 py-2 mt-1 mb-1">Management</div>
            {navItems.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => navigateTo(id)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-body-sm transition-all duration-fast border-l-2 ${
                  activeSection === id
                    ? "text-primary border-primary bg-primary/10 font-medium"
                    : "text-secondary-foreground/65 border-transparent hover:text-secondary-foreground hover:bg-secondary-foreground/5"
                }`}
              >
                <span className={`w-1.5 h-1.5 flex-shrink-0 ${activeSection === id ? "bg-primary" : "bg-current opacity-50"}`} />
                <span className="flex-1 text-left">{label}</span>
                {count !== undefined && (
                  <span className="font-mono text-caption opacity-50">{String(count).padStart(2, "0")}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="border-t border-secondary-foreground/5 px-6 py-4 space-y-2">
            <Link to="/" className="flex items-center gap-2.5 text-secondary-foreground/40 hover:text-secondary-foreground/70 text-caption transition-colors duration-fast">
              <Home className="w-3.5 h-3.5" /> Back to Site
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("adminAuth"); setIsAuthenticated(false); }}
              className="flex items-center gap-2.5 text-secondary-foreground/40 hover:text-destructive/80 text-caption transition-colors duration-fast w-full"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* ─── Main ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 bg-card border-b border-border flex items-center justify-between px-gutter sm:px-gutter-lg flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 -ml-1 hover:bg-muted rounded transition-colors duration-fast"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="font-serif text-body-sm sm:text-body-lg font-semibold text-foreground tracking-wide">
                {navItems.find((n) => n.id === activeSection)?.label ?? "Dashboard"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-gutter sm:p-gutter-md lg:p-gutter-lg">
            {activeSection === "dashboard" && <Dashboard navItems={navItems} setActiveSection={navigateTo} />}
            {activeSection === "urun-ekle" && <ProductAdd />}
            {activeSection === "urun-duzenle" && <ProductEdit />}
            {activeSection === "one-cikan" && <FeaturedProducts />}
            {activeSection === "hero" && <HeroSectionPanel />}
            {activeSection === "kategoriler" && <CategoryManager />}
            {activeSection === "vitrin" && <CategoryShowcase />}
            {activeSection === "ayarlar" && <AdminSettings />}
          </main>
        </div>

        {/* ─── Unsaved Changes Modal ────────────────────── */}
        {pendingSection && (
          <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border shadow-2xl w-full max-w-md mx-4">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-destructive/5">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-body-lg font-semibold text-foreground">Unsaved Changes</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  You have unsaved changes on this page. If you continue without saving, your changes will be lost.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t border-border bg-background">
                <button
                  onClick={cancelDiscard}
                  className="px-5 h-9 text-body-sm font-medium border border-border bg-card hover:bg-background text-foreground transition-colors duration-fast"
                >
                  Continue Editing
                </button>
                <button
                  onClick={confirmDiscard}
                  className="px-5 h-9 text-body-sm font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors duration-fast"
                >
                  Discard and Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminContext.Provider>
  );
}
