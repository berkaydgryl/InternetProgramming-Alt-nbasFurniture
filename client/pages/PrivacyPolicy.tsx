import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta name="description" content="Altınbaş Furniture Accessories privacy policy. Information about the protection of personal data and the use of cookies." />
        <link rel="canonical" href={`${SITE_URL}/gizlilik-politikasi`} />
      </Helmet>
      <Header />

      <main id="main-content" className="max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg py-section-sm sm:py-section-md">
        <h1 className="font-serif text-h2 font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-body text-muted-foreground leading-relaxed">
          <p className="text-body-lg text-foreground font-medium">
            Last updated: April 9, 2026
          </p>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">1. Data Controller</h2>
            <p>
              This website is operated by Altınbaş Furniture Accessories (the "Company").
              Your personal data is protected under the Turkish Personal Data Protection Law No. 6698 (KVKK)
              and the European Union General Data Protection Regulation (GDPR).
            </p>
            <p className="mt-2">
              <strong>Address:</strong> Mahmutbey, Istanbul<br />
              <strong>Email:</strong>{" "}
              <a href="mailto:info@altinbasmobilya.com" className="text-primary hover:underline">
                info@altinbasmobilya.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">2. Personal Data Collected</h2>
            <p>The following personal data may be collected through our website:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Contact form:</strong> Full name, email address, phone number, message content</li>
              <li><strong>Cookies:</strong> Browser type, visit duration, page views (analytics cookies require consent)</li>
              <li><strong>WhatsApp communication:</strong> Information you share via WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">3. Purpose of Data Processing</h2>
            <p>Your personal data is processed for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Responding to your contact requests</li>
              <li>Providing information about our products and services</li>
              <li>Analyzing website usage statistics (with your consent)</li>
              <li>Fulfilling legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">4. Legal Basis for Processing</h2>
            <p>Your personal data is processed under Article 5 of KVKK based on the following legal grounds:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Your explicit consent (analytics and marketing cookies)</li>
              <li>Direct relevance to the establishment or performance of a contract</li>
              <li>The legitimate interests of the data controller (site security, service improvement)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">5. Cookie Policy</h2>
            <p>The following types of cookies are used on our website:</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border border-border text-body-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Cookie Type</th>
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Purpose</th>
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 font-medium text-foreground">Essential</td>
                    <td className="border border-border px-4 py-2">Core site functionality, session management</td>
                    <td className="border border-border px-4 py-2">For the duration of the session</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-medium text-foreground">Analytics</td>
                    <td className="border border-border px-4 py-2">Google Analytics, Hotjar — visitor statistics</td>
                    <td className="border border-border px-4 py-2">Up to 2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 font-medium text-foreground">Marketing</td>
                    <td className="border border-border px-4 py-2">Personalized advertising and social media</td>
                    <td className="border border-border px-4 py-2">Up to 1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Analytics and marketing cookies are enabled only with your explicit consent.
              You can change your preferences at any time through the "Cookie Preferences" link at the bottom of the page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">6. Data Transfers</h2>
            <p>
              Your personal data may be transferred abroad through analytics service providers (Google, Hotjar).
              This transfer is based on your explicit consent under Article 9 of KVKK.
              No data will be transferred abroad without your consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">7. Rights of the Data Subject (KVKK Article 11)</h2>
            <p>Under KVKK, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>To learn whether your personal data is being processed</li>
              <li>To request information if your data has been processed</li>
              <li>To learn the purpose of the processing and whether it is being used for that purpose</li>
              <li>To know the third parties to whom your data is transferred, domestically or abroad</li>
              <li>To request correction if your data has been processed incompletely or incorrectly</li>
              <li>To request deletion or destruction within the scope of Article 7 of KVKK</li>
              <li>To object to any unfavorable outcome arising from the analysis of your data exclusively through automated systems</li>
              <li>To request compensation for damages arising from the unlawful processing of your data</li>
            </ul>
            <p className="mt-2">
              You can submit your requests to{" "}
              <a href="mailto:info@altinbasmobilya.com" className="text-primary hover:underline">
                info@altinbasmobilya.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">8. Security Measures</h2>
            <p>
              Technical and administrative measures such as SSL/TLS encryption, firewalls,
              access control, and regular security audits are implemented to protect your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-h4 font-bold text-foreground mt-8 mb-3">9. Changes</h2>
            <p>
              This privacy policy may be updated as needed.
              Significant changes will be announced through our website.
            </p>
          </section>

          <div className="pt-6 border-t border-border mt-8">
            <Link to="/iletisim" className="text-primary font-semibold hover:underline">
              ← Back to Contact Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
