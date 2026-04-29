export interface HomepageCategory {
  id: number; name: string; description: string;
  icon: string; image: string;
}

export interface HeroSection {
  tag: string; title: string; description: string;
  image: string; link: string;
}

export interface Product {
  id: number; category: string; name: string;
  description: string; images: string[]; isActive?: boolean; isFeatured?: boolean;
}

export interface WhatsAppNumber {
  id: number; name: string; number: string; isMain: boolean;
}

export interface CategoryWhatsApp {
  category: string; numberId: number;
}

export const defaultHero: HeroSection = {
  tag: "Piece of the Week", title: "Sapphire Blue Dresser",
  description: "Crafted with custom lacquer paint and brass details.",
  image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000",
  link: "/koleksiyonlar",
};
