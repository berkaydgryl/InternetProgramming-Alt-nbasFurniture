import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: boolean;   // Always true — strictly necessary cookies
  analytics: boolean;   // GA4, Hotjar, etc.
  marketing: boolean;   // Facebook Pixel, etc.
}

interface ConsentContextType {
  consent: ConsentState;
  hasResponded: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (categories: Partial<ConsentState>) => void;
}

const CONSENT_KEY = "cookie_consent";

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const ConsentContext = createContext<ConsentContextType | null>(null);

function loadConsent(): { consent: ConsentState; hasResponded: boolean } {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ConsentState;
      return { consent: { ...parsed, necessary: true }, hasResponded: true };
    }
  } catch { /* ignore */ }
  return { consent: defaultConsent, hasResponded: false };
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

/** Push consent status to dataLayer (GTM Consent Mode v2) */
function pushConsentToDataLayer(consent: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadConsent);

  // On initial load, push the current consent state to the dataLayer
  useEffect(() => {
    if (state.hasResponded) {
      pushConsentToDataLayer(state.consent);
    }
  }, []);

  const setAndSave = useCallback((consent: ConsentState) => {
    saveConsent(consent);
    pushConsentToDataLayer(consent);
    setState({ consent, hasResponded: true });
  }, []);

  const acceptAll = useCallback(() => {
    setAndSave({ necessary: true, analytics: true, marketing: true });
  }, [setAndSave]);

  const rejectAll = useCallback(() => {
    setAndSave({ necessary: true, analytics: false, marketing: false });
  }, [setAndSave]);

  const updateConsent = useCallback((categories: Partial<ConsentState>) => {
    const next = { ...state.consent, ...categories, necessary: true };
    setAndSave(next);
  }, [state.consent, setAndSave]);

  return (
    <ConsentContext.Provider value={{ consent: state.consent, hasResponded: state.hasResponded, acceptAll, rejectAll, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
