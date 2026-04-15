// Must match JWT `iss` from @convex-dev/auth (see generateToken → CONVEX_SITE_URL).
// SITE_URL is only for OAuth redirects / magic links, not for this domain.
const domain = (
  process.env.CONVEX_SITE_URL ??
  process.env.SITE_URL ??
  "http://localhost:5173"
).replace(/\/$/, "");

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};
