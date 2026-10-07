// Application Version configuration
// Updated automatically on each build/release
export const APP_VERSION = "1.8.3";
export const BUILD_TIMESTAMP = "2026-10-07T00:01:00Z";

if (typeof window !== "undefined") {
  window.__APP_VERSION__ = APP_VERSION;
  window.__BUILD_TIMESTAMP__ = BUILD_TIMESTAMP;
}

