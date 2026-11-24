import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

connectDB().then(() =>
  app.listen(env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${env.PORT}`);
  }),
);
