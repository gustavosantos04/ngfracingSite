// Known production resources of this project. Fail closed if accidentally pulled locally.
const productionEndpoint = "ep-quiet-fog-acbasb6k";
const productionBlobHost = "aktrfq1jwvzwlpjn.public.blob.vercel-storage.com";

export function assertDatabaseEnvironment(url: string | undefined, environment = process.env.VERCEL_ENV) {
  if (!url) return;
  let hostname: string;
  try { hostname = new URL(url).hostname; }
  catch { throw new Error("Invalid database connection configuration"); }
  if (environment !== "production" &&
      (hostname === `${productionEndpoint}.sa-east-1.aws.neon.tech` ||
       hostname.startsWith(`${productionEndpoint}-`))) {
    throw new Error("Production database access is blocked outside Vercel Production. Use the isolated development or preview branch.");
  }
}

export function assertBlobEnvironment(hostname: string, token: string, environment = process.env.VERCEL_ENV) {
  const store = hostname.split(".")[0];
  if (!token.toLowerCase().startsWith(`vercel_blob_rw_${store}_`)) {
    throw new Error("Blob token and hostname must identify the same store");
  }
  if (environment !== "production" && hostname === productionBlobHost) {
    throw new Error("Production Blob uploads are blocked outside Vercel Production");
  }
}
