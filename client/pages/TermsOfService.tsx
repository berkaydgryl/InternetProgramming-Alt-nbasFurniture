import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service | {SITE_NAME}</title>
        <meta name="description" content="Altınbaş Furniture Accessories website terms of use and conditions." />
        <link rel="canonical" href={`${SITE_URL}/hizmet-sartlari`} />
      </Helmet>
      <Header />

      <main id="main-content" className="max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg py-section-sm sm:py-section-md">
        <h1 className="font-serif text-h2 font-bold text-foreground mb-8">Terms of Service</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-body text-muted-foreground leading-relaxed">
          <p className="text-body-lg text-foreground font-medium">
            Last updated: April 9, 2026
          </p>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">1. General Provisions</h2>
            <p>
              By using this website (the "Site"), you agree to the following terms.
              The Site is operated by Altınbaş Furniture Accessories (the "Company").
              If you do not accept the terms, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">2. Scope of Services</h2>
            <p>The following services are offered through the Site:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Browsing the product catalog</li>
              <li>Requesting prices and information via WhatsApp</li>
              <li>Sending messages through the contact form</li>
              <li>Learning about the Company</li>
            </ul>
            <p className="mt-2">
              The Site is not an e-commerce platform. Product sales are not made directly through the site;
              pricing information and the order process are conducted via WhatsApp or in person.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">3. Intellectual Property</h2>
            <p>
              All content on the Site (text, images, logos, designs) belongs to
              Altınbaş Furniture Accessories and is protected by Law No. 5846 on Intellectual and Artistic Works.
              Copying, reproducing, or distributing it without permission is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">4. Product Information and Pricing</h2>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Product images displayed on the Site are representative; there may be color and size differences.</li>
              <li>Prices are not stated on the site; up-to-date pricing information can be obtained via WhatsApp or phone.</li>
              <li>The Company reserves the right to change product features and prices without prior notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">5. User Obligations</h2>
            <p>You must comply with the following rules when using the Site:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the Site in accordance with the law</li>
              <li>Do not provide misleading or false information</li>
              <li>Do not attempt to disrupt the operation of the Site</li>
              <li>Do not infringe on the rights of other users</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">6. Limitation of Liability</h2>
            <p>
              The Company does not guarantee that the Site will operate uninterrupted or error-free.
              The Company is not responsible for the content of third-party links accessed via the Site.
              While the utmost care is taken regarding the accuracy of the information on the Site,
              the timeliness of the information is not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">7. Privacy</h2>
            <p>
              For detailed information about the processing of your personal data, please review our{" "}
              <Link to="/gizlilik-politikasi" className="text-primary font-medium hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">8. Dispute Resolution</h2>
            <p>
              The laws of the Republic of Türkiye apply to disputes arising from these terms.
              The Istanbul (Mahmutbey) Courts and Enforcement Offices are authorized to resolve any disputes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">9. Changes</h2>
            <p>
              The Company reserves the right to update these terms of service without prior notice.
              The most current terms are always published on this page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">10. Contact</h2>
            <p>
              For your questions, you can email us at{" "}
              <a href="mailto:info@altinbasmobilya.com" className="text-primary hover:underline">
                info@altinbasmobilya.com
              </a>{" "}
              or visit our{" "}
              <Link to="/iletisim" className="text-primary font-medium hover:underline">
                contact page
              </Link>.
            </p>
          </section>

          <div className="pt-6 border-t border-border mt-8">
            <Link to="/" className="text-primary font-semibold hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
