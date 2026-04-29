import { createRoot } from "react-dom/client";
import { initSentry } from "./lib/sentry";
import App from "./App";

// Initialize Sentry before React renders
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
