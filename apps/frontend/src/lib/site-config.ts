const productionSiteOrigin = "https://dashing-cascaron-efc780.netlify.app";
const productionApiOrigin = "https://appscrip-server.onrender.com";

function configuredOrigin(value: string | undefined, productionOrigin: string, developmentOrigin: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const url = new URL(value?.trim() || (isProduction ? productionOrigin : developmentOrigin));
  const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

  // A copied local .env value must not become a public canonical or API URL.
  return isProduction && isLocalhost ? productionOrigin : url.origin;
}

export const siteOrigin = configuredOrigin(process.env.SITE_URL, productionSiteOrigin, "http://localhost:3000");
export const apiBase = configuredOrigin(process.env.API_BASE_URL, productionApiOrigin, "http://localhost:4000");
