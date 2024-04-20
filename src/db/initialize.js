import { migration_001_base } from "./migrations/001";
import { migration_002 } from "./migrations/002";
import SQLiteClient from "./SQLiteClient";

const DB_NAME = "MyArenaMobile.db";
const DB_DEBUG = true;
const DB_MIGRATIONS = [migration_001_base, migration_002];

/** Application's SQLite client */
export const dbClient = new SQLiteClient(DB_NAME, DB_MIGRATIONS, DB_DEBUG);

/** Applicaiton initialization. */
export const initialize = async () => dbClient.connect();
