import { createContext, useContext } from "react";
import type { Product, HomepageCategory, HeroSection, WhatsAppNumber, CategoryWhatsApp } from "./types";

export interface AdminContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sidebarCategories: string[];
  setSidebarCategories: React.Dispatch<React.SetStateAction<string[]>>;
  homepageCategories: HomepageCategory[];
  setHomepageCategories: React.Dispatch<React.SetStateAction<HomepageCategory[]>>;
  heroSection: HeroSection;
  setHeroSection: React.Dispatch<React.SetStateAction<HeroSection>>;
  showPrice: boolean;
  setShowPrice: React.Dispatch<React.SetStateAction<boolean>>;
  whatsappNumbers: WhatsAppNumber[];
  setWhatsappNumbers: React.Dispatch<React.SetStateAction<WhatsAppNumber[]>>;
  categoryWhatsapp: CategoryWhatsApp[];
  setCategoryWhatsapp: React.Dispatch<React.SetStateAction<CategoryWhatsApp[]>>;
  saving: boolean;
  handleSave: () => Promise<boolean>;
  updateProduct: (id: number, field: keyof Product, value: string | string[] | boolean) => void;
  updateHomepageCategory: (id: number, field: keyof HomepageCategory, value: string) => void;
  handleImageUpload: (id: number, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleProductImageUpload: (productId: number, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeProductImage: (productId: number, imageIndex: number) => void;
  markDirty: () => void;
  authHeaders: () => HeadersInit;
}

export const AdminContext = createContext<AdminContextType>(null!);
export const useAdmin = () => useContext(AdminContext);
