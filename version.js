// Application Version configuration
// Updated automatically on each build/release
export const APP_VERSION = "1.0.15";
export const BUILD_TIMESTAMP = "2026-10-04T07:04:00Z";

if (typeof window !== "undefined") {
  window.__APP_VERSION__ = APP_VERSION;
  window.__BUILD_TIMESTAMP__ = BUILD_TIMESTAMP;
}
