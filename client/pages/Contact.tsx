import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/lib/seo";
import { trackContactSubmit, trackWhatsAppClick } from "@/lib/analytics";
import TurnstileWidget from "@/components/TurnstileWidget";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot — bots fill this in, real users don't see it
  });
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formError, setFormError] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((res) => res.json()),
  });

  const whatsappNumber = settings?.whatsappNumber || "905358712233";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkConsent) return;

    // Honeypot check — if a bot filled it, silently show success
    if (formData.website) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      return;
    }

    // Server-side validation
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          website: formData.website,
          turnstileToken: turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "An error occurred. Please try again.");
        return;
      }
    } catch {
      setFormError("Connection error. Please try again.");
      return;
    }

    // Send the message via WhatsApp
    const text = `Hello, I'm ${formData.name}.%0A${formData.email ? `Email: ${formData.email}%0A` : ""}${formData.phone ? `Phone: ${formData.phone}%0A` : ""}%0A${formData.message}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
    trackContactSubmit();
    trackWhatsAppClick("contact_form");
    setFormData({ name: "", email: "", phone: "", message: "", website: "" });
    setKvkkConsent(false);
    setTurnstileToken("");
    setFormError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact | {SITE_NAME}</title>
        <meta name="description" content="Get in touch with Altınbaş Furniture Accessories. Mahmutbey, Istanbul. WhatsApp, phone, email, and visit information." />
        <link rel="canonical" href={`${SITE_URL}/iletisim`} />
        <meta property="og:title" content={`Contact | ${SITE_NAME}`} />
        <meta property="og:description" content="Reach out to us with your questions and special requests." />
        <meta property="og:url" content={`${SITE_URL}/iletisim`} />
        <meta property="og:image" content={`${SITE_URL}${OG_IMAGE}`} />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <main id="main-content">
      <section className="py-section-sm sm:py-section-md md:py-section-lg bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg text-center">
          <h1 className="font-serif text-h1 font-bold text-foreground mb-3 sm:mb-4">
            Contact
          </h1>
          <p className="text-body sm:text-h4 text-muted-foreground max-w-2xl mx-auto">
            Reach out to us with your questions and special requests.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-section-sm sm:py-section-md md:py-section-lg">
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-serif text-h3 font-bold text-foreground mb-4 sm:mb-6">
                  Get in Touch
                </h2>
                <p className="text-body sm:text-body-lg text-muted-foreground mb-6 sm:mb-8">
                  Don't hesitate to contact us with your questions, suggestions,
                  or custom design requests.
                </p>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Workshop & Showroom</h3>
                    <a
                      href={
                        /iPad|iPhone|iPod/.test(navigator.userAgent)
                          ? "maps://maps.apple.com/?q=Mahmutbey+Istanbul"
                          : "https://www.google.com/maps/search/?api=1&query=Mahmutbey+Istanbul"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors duration-fast cursor-pointer block"
                    >
                      Mahmutbey, Istanbul, Türkiye
                      <span className="block text-2xs text-primary mt-1 font-medium">
                        📍 Show on Map →
                      </span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl">📞</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">WhatsApp & Phone</h3>
                    <p className="text-muted-foreground">
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors duration-fast flex items-center gap-2"
                      >
                        +{whatsappNumber.slice(0,2)} {whatsappNumber.slice(2,5)} {whatsappNumber.slice(5,8)} {whatsappNumber.slice(8,10)} {whatsappNumber.slice(10,12)}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:info@altinbasmobilya.com" className="hover:text-primary transition-colors duration-fast">
                        info@altinbasmobilya.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl">🕐</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Visiting Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Saturday: 09:00 - 19:00
                      <br />
                      Sunday: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-xl border border-border p-5 sm:p-8">
              <h3 className="font-serif text-h3 font-bold text-foreground mb-4 sm:mb-6">
                Send a Message
              </h3>
              {submitted && (
                <div role="alert" className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-body">
                  Your message has been sent via WhatsApp. We will get back to you as soon as possible.
                </div>
              )}
              {formError && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-body">
                  {formError}
                </div>
              )}
              <form ref={formRef} onSubmit={handleSubmit} aria-label="Contact form" className="space-y-5">
                {/* Honeypot — bots fill this in, real users don't see it */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-body font-semibold text-foreground mb-2">Full Name <span className="text-destructive" aria-hidden="true">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body"
                    placeholder="Your name" required aria-required="true" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-body font-semibold text-foreground mb-2">Email <span className="text-destructive" aria-hidden="true">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body"
                    placeholder="Your email address" required aria-required="true" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-body font-semibold text-foreground mb-2">Phone</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body"
                    placeholder="Your phone number" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-body font-semibold text-foreground mb-2">Message <span className="text-destructive" aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-body"
                    placeholder="Your message..." required aria-required="true" />
                </div>
                {/* Cloudflare Turnstile */}
                {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
                  <div>
                    <TurnstileWidget
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                      onVerify={setTurnstileToken}
                    />
                  </div>
                )}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kvkkConsent}
                      onChange={(e) => setKvkkConsent(e.target.checked)}
                      required
                      aria-required="true"
                      className="mt-1 w-4 h-4 rounded border-border accent-primary flex-shrink-0"
                    />
                    <span className="text-body-sm text-muted-foreground leading-relaxed">
                      I have read the{" "}
                      <Link to="/gizlilik-politikasi" target="_blank" className="text-primary font-medium hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      and consent to the processing of my personal data.{" "}
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </label>
                </div>
                <button type="submit"
                  disabled={!kvkkConsent}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-base text-body-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="px-gutter sm:px-gutter-md lg:px-gutter-lg xl:px-gutter-xl py-12">
          <div className="text-center text-muted-foreground text-body space-y-2">
            <p>&copy; {new Date().getFullYear()} Altınbaş Furniture Accessories. All rights reserved.</p>
            <div className="flex justify-center gap-4">
              <Link to="/gizlilik-politikasi" className="hover:text-primary transition-colors duration-fast">Privacy Policy</Link>
              <Link to="/hizmet-sartlari" className="hover:text-primary transition-colors duration-fast">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
