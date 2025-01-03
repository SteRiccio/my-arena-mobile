import SQLiteClient from "./SQLiteClient";
import { migration_001_base } from "./migrations/001";
import { migration_002 } from "./migrations/002";
import { migration_003 } from "./migrations/003";
import { migration_004 } from "./migrations/004";
import { migration_005 } from "./migrations/005";

const dbName = "MyArenaMobile.db";
const debug = true;
const dbMigrations = [
  migration_001_base,
  migration_002,
  migration_003,
  migration_004,
  migration_005,
];

/** Application's SQLite client */
export const dbClient = new SQLiteClient(dbName, dbMigrations, debug);

/** Applicaiton initialization. */
export const initialize = async () => dbClient.connect();
