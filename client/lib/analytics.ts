/**
 * Analytics helper functions
 * All events are sent to GTM via the dataLayer.
 * Thanks to GTM consent mode, events are not processed if the user has not given consent.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

/** Page view — called on SPA route changes */
export function trackPageView(path: string, title: string) {
  push({
    event: "page_view",
    page_path: path,
    page_title: title,
  });
}

/** WhatsApp click */
export function trackWhatsAppClick(source: string, productName?: string) {
  push({
    event: "whatsapp_click",
    click_source: source,
    product_name: productName || undefined,
  });
}

/** Product gallery interaction */
export function trackGalleryInteraction(productName: string, imageIndex: number, action: "next" | "prev" | "thumbnail") {
  push({
    event: "gallery_interaction",
    product_name: productName,
    image_index: imageIndex,
    interaction_type: action,
  });
}

/** Category view */
export function trackCategoryView(category: string, productCount: number) {
  push({
    event: "category_view",
    category_name: category,
    product_count: productCount,
  });
}

/** Product detail view */
export function trackProductView(productName: string, category: string) {
  push({
    event: "product_view",
    product_name: productName,
    product_category: category,
  });
}

/** Contact form submission */
export function trackContactSubmit() {
  push({
    event: "contact_form_submit",
  });
}
