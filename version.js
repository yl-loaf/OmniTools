// Application Version configuration
// Updated automatically on each build/release
export const APP_VERSION = "1.4.0";
export const BUILD_TIMESTAMP = "2026-10-05T00:14:00Z";

if (typeof window !== "undefined") {
  window.__APP_VERSION__ = APP_VERSION;
  window.__BUILD_TIMESTAMP__ = BUILD_TIMESTAMP;
}
