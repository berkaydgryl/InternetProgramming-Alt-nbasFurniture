import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function WhatsAppButton() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  const phoneNumber = settings?.whatsappNumbers?.find((n: { isMain: boolean }) => n.isMain)?.number
    || settings?.whatsappNumber || "905358712233";
  const message = "Hello, could I get some information about your products?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("floating_button")}
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-fab flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-whatsapp text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-base group"
      aria-label="Get in touch on WhatsApp (opens in a new window)"
    >
      <MessageCircle size={28} aria-hidden="true" className="sm:!w-8 sm:!h-8 group-hover:animate-pulse" />
      <span className="hidden sm:block absolute right-full mr-4 bg-card text-foreground px-4 py-2 rounded-lg text-body font-bold shadow-xl opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-base whitespace-nowrap pointer-events-none border border-border">
        Price Inquiry & Support
      </span>
    </a>
  );
}
