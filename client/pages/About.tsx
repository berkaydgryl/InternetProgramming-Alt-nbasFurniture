import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/lib/seo";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | {SITE_NAME}</title>
        <meta name="description" content="Where art and craftsmanship have come together for over thirty years. The story, mission, and vision of Altınbaş Furniture Accessories." />
        <link rel="canonical" href={`${SITE_URL}/hakkimizda`} />
        <meta property="og:title" content={`About Us | ${SITE_NAME}`} />
        <meta property="og:description" content="Where art and craftsmanship have come together for over thirty years." />
        <meta property="og:url" content={`${SITE_URL}/hakkimizda`} />
        <meta property="og:image" content={`${SITE_URL}${OG_IMAGE}`} />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <main id="main-content">
      <section className="py-section-sm sm:py-section-md md:py-section-lg bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
        <div className="max-w-wide mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg text-center">
          <h1 className="font-serif text-h1 font-bold text-foreground mb-3 sm:mb-4">
            About Us
          </h1>
          <p className="text-body sm:text-h4 text-muted-foreground max-w-2xl mx-auto">
            Where art and craftsmanship have come together for over thirty years
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-section-sm sm:py-section-md md:py-section-lg">
        <div className="max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg">
          <div className="prose prose-invert max-w-none space-y-6 sm:space-y-8">
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 md:p-12">
              <div className="text-4xl sm:text-6xl text-center mb-5 sm:mb-8">🏢</div>
              <h2 className="font-serif text-h3 font-bold text-foreground mb-3 sm:mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed text-body sm:text-sub">
                We are a company specialized in furniture design, renowned for
                our distinguished handcrafted products. Each of our pieces is a
                reflection of our artistry and passion. We are a brand that uses
                natural materials and follows eco-friendly production processes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
                <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                <p className="text-muted-foreground text-body">
                  To beautify living spaces and ensure that people can spend time in comfortable environments.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👁️</div>
                <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
                <p className="text-muted-foreground text-body">
                  To become a globally recognized, sustainable, and innovative furniture brand.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💎</div>
                <h3 className="font-semibold text-foreground mb-2">Our Values</h3>
                <p className="text-muted-foreground text-body">
                  Quality, integrity, innovation, and environmental responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-sm sm:py-section-md bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-content mx-auto px-gutter sm:px-gutter-md lg:px-gutter-lg text-center">
          <h2 className="font-serif text-h3 font-bold text-foreground mb-3 sm:mb-4">
            Join us on this journey
          </h2>
          <p className="text-body sm:text-body-lg text-muted-foreground mb-5 sm:mb-6">
            Get in touch for custom designs or more information.
          </p>
          <Link
            to="/iletisim"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-base"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="px-gutter sm:px-gutter-md lg:px-gutter-lg xl:px-gutter-xl py-12">
          <div className="text-center text-muted-foreground text-body">
            <p>&copy; {new Date().getFullYear()} Altınbaş Furniture Accessories. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
