import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  schema,
});

export default db;
