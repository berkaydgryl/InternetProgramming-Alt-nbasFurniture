import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sentry } from "@/lib/sentry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
    Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            An error occurred while loading the page. Please refresh the page or return to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
            >
              Back to Home
            </Link>
          </div>
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <pre className="mt-6 text-left text-xs text-destructive bg-destructive/5 p-4 rounded-lg overflow-auto max-h-40">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
