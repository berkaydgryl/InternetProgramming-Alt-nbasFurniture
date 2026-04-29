import { ImgHTMLAttributes, forwardRef, useCallback } from "react";
import { Sentry } from "@/lib/sentry";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** "high" for LCP/hero images, "low" for below-fold */
  fetchPriority?: "high" | "low" | "auto";
}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ loading = "lazy", fetchPriority, style, onError, ...props }, ref) => {
    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        const src = (e.target as HTMLImageElement).src;
        Sentry.captureMessage("Image load failed", {
          level: "warning",
          extra: { src, alt: props.alt },
        });
        onError?.(e);
      },
      [onError, props.alt],
    );

    return (
      <img
        ref={ref}
        loading={loading}
        // @ts-expect-error fetchpriority not yet in React types
        fetchpriority={fetchPriority}
        style={{
          contentVisibility: loading === "lazy" ? "auto" : undefined,
          ...style,
        }}
        onError={handleError}
        {...props}
      />
    );
  },
);

LazyImage.displayName = "LazyImage";

export { LazyImage };
