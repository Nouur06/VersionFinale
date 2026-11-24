import mongoose from "mongoose";
import { env } from "./env.js";
import dns from "node:dns";

mongoose.set("debug", env.NODE_ENV === "development");

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DBNAME,
      ...(env.MONGODB_USERNAME
        ? {
            auth: {
              username: env.MONGODB_USERNAME,
              password: env.MONGODB_PASSWORD,
            },
          }
        : {}),
    });
    console.log("Base de données connectée");
    return connection;
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
}
if (env.DNS_SERVERS) {
  dns.setServers(
    env.DNS_SERVERS.split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  );
  console.log("DNS utilisés :", dns.getServers().join(", "));
}
