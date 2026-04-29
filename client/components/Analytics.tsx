import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useConsent } from "@/lib/consent";
import { trackPageView } from "@/lib/analytics";

const GTM_ID = import.meta.env.VITE_GTM_ID || "";
const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID || "";

/** Inject the GTM script into the head (once) */
function loadGTM(id: string) {
  if (!id || document.getElementById("gtm-script")) return;
  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
}

/** Inject the Hotjar script into the head (once) */
function loadHotjar(id: string) {
  if (!id || document.getElementById("hotjar-script")) return;
  const script = document.createElement("script");
  script.id = "hotjar-script";
  script.textContent = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=6');`;
  document.head.appendChild(script);
}

/**
 * Analytics component — loads scripts based on consent state.
 * Must be rendered inside a BrowserRouter (uses useLocation).
 */
export default function Analytics(): null {
  const { consent, hasResponded } = useConsent();
  const location = useLocation();

  // Load analytics scripts once consent is granted
  useEffect(() => {
    if (!hasResponded) return;

    if (consent.analytics) {
      loadGTM(GTM_ID);
      loadHotjar(HOTJAR_ID);
    }
  }, [consent.analytics, hasResponded]);

  // Send page_view on SPA route transitions
  useEffect(() => {
    if (hasResponded && consent.analytics) {
      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location.pathname, location.search, hasResponded, consent.analytics]);

  // Set the default consent state at startup (GTM Consent Mode v2)
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_default",
      analytics_storage: "denied",
      ad_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      wait_for_update: 500,
    });
  }, []);

  return null;
}
