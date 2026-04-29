import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { SITE_NAME } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Not Found | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-2xl">
          <p aria-hidden="true" className="text-9xl font-serif font-bold text-primary mb-4">
            404
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            The Page You Were Looking For Was Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            This page may have been removed or its address may have changed.
            Return to the home page or get in touch with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
            >
              Contact for Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
