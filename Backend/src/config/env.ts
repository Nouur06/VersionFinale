import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
};

if (!process.env.JWT_SECRET && !isProd) {
  console.warn(
    "⚠️  JWT_SECRET absent : secret de développement utilisé (interdit en production).",
  );
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CLIENT_URL: process.env.CLIENT_URL ?? "*",
  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DBNAME: required("MONGODB_DBNAME"),
  MONGODB_USERNAME: process.env.MONGODB_USERNAME ?? "",
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD ?? "",
  DNS_SERVERS: process.env.DNS_SERVERS ?? "",
  JWT_SECRET: isProd
    ? required("JWT_SECRET")
    : (process.env.JWT_SECRET ?? "development-secret"),
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL ?? "",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD ?? "",
  // Photos : si ces 3 variables sont définies, les images vont sur Cloudinary (sinon disque local)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",
} as const;

export default env;
