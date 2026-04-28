// Trim whitespace from string fields before validating / saving.
// XSS protection itself is handled by React's default JSX text escaping
// when we render values back to the browser, not by stripping characters here.
export function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function sanitizePayload(payload) {
  const result = {};
  Object.keys(payload).forEach((key) => {
    result[key] = sanitizeText(payload[key]);
  });
  return result;
}
