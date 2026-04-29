import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsent } from "@/lib/consent";

export default function CookieConsent() {
  const { hasResponded, acceptAll, rejectAll, updateConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  if (hasResponded) return null;

  const handleSavePreferences = () => {
    updateConsent({ analytics: analyticsChecked, marketing: marketingChecked });
  };

  return (
    <div
      role="dialog"
      aria-label="Manage your cookie preferences"
      className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl shadow-2xl p-5 sm:p-6">
        <h2 className="font-serif text-sub font-bold text-foreground mb-2">
          Your Cookie Preferences
        </h2>
        <p className="text-body-sm text-muted-foreground mb-4 leading-relaxed">
          We use cookies to improve our website and provide you with a better experience.
          For more details, please review our{" "}
          <Link to="/gizlilik-politikasi" className="text-primary font-medium hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        {showDetails && (
          <div className="space-y-3 mb-4 border-t border-border pt-4">
            {/* Required */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
              />
              <div>
                <span className="text-body font-semibold text-foreground">Essential Cookies</span>
                <p className="text-2xs text-muted-foreground">
                  Required for the core functions of the site. Cannot be disabled.
                </p>
              </div>
            </label>

            {/* Analytics */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
              />
              <div>
                <span className="text-body font-semibold text-foreground">Analytics Cookies</span>
                <p className="text-2xs text-muted-foreground">
                  Visitor statistics and site usage analysis (Google Analytics, Hotjar).
                </p>
              </div>
            </label>

            {/* Marketing */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingChecked}
                onChange={(e) => setMarketingChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
              />
              <div>
                <span className="text-body font-semibold text-foreground">Marketing Cookies</span>
                <p className="text-2xs text-muted-foreground">
                  Personalized advertising and social media integrations.
                </p>
              </div>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {showDetails ? (
            <button
              onClick={handleSavePreferences}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-body"
            >
              Save My Preferences
            </button>
          ) : (
            <>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-body"
              >
                Accept All
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors text-body"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 px-4 py-2.5 border border-border text-muted-foreground font-medium rounded-lg hover:bg-muted transition-colors text-body-sm"
              >
                Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
