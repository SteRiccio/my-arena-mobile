import { migration_001_base } from "./migrations/001";
import SQLiteClient from "./SQLiteClient";

const DB_NAME = "MyArenaMobile.db";
const DB_DEBUG = true;
const DB_MIGRATIONS = [migration_001_base];

/** Application's SQLite client */
export const dbClient = new SQLiteClient(DB_NAME, DB_MIGRATIONS, DB_DEBUG);

/** Applicaiton initialization. */
export const initialize = async () => {
  await dbClient.connect();
};
