import * as SQLite from "expo-sqlite";

export class DowngradeError extends Error {
  constructor() {
    super();
    this.name = "DowngradeError";
  }
}

export default class SQLiteClient {
  constructor(name, migrations, debug = false) {
    this.name = name;
    this.migrations = migrations;
    this.privateDb = null;
    this.privateConnected = false;
  }

  get connected() {
    return this.privateConnected;
  }

  get db() {
    return this.privateDb;
  }

  async executeSql(sql, params) {
    const result = await this.privateDb.runAsync(sql, params);
    const { lastInsertRowId: insertId, changes: rowsAffected } = result;
    return { insertId, rowsAffected };
  }

  async transaction(callback) {
    return this.privateDb.withTransactionAsync(callback);
  }

  async one(sql, params) {
    return this.privateDb.getFirstAsync(sql, params);
  }

  async many(sql, params) {
    return this.privateDb.getAllAsync(sql, params);
  }

  async connect() {
    if (this.privateConnected) {
      return { dbMigrationsRun: false };
    }
    try {
      console.log("=== DB connection start ===");

      this.privateDb = await SQLite.openDatabaseAsync(this.name);

      // MIGRATIONS
      const dbUserVersionRow = await this.one("PRAGMA user_version");
      const prevDbVersion = dbUserVersionRow.user_version;
      console.log(`==== current DB version: ${prevDbVersion}`);
      const nextDbVersion = this.migrations.length;
      console.log(`==== next DB version: ${nextDbVersion}`);
      if (prevDbVersion > nextDbVersion) {
        throw new DowngradeError();
      }
      const dbMigrationsNecessary = prevDbVersion !== nextDbVersion;
      if (dbMigrationsNecessary) {
        console.log("==== DB migrations start ====");
        for (let i = prevDbVersion; i < nextDbVersion; i += 1) {
          const migration = this.migrations[i];
          await migration(this);
        }
        console.log("==== DB migrations complete ====");

        await this.executeSql(`PRAGMA user_version = ${nextDbVersion}`);
      }

      this.privateConnected = true;
      console.log("=== DB connection complete ===");
      return {
        dbMigrationsRun: dbMigrationsNecessary,
        prevDbVersion,
        nextDbVersion,
      };
    } catch (err) {
      console.log(err);
      if (err instanceof DowngradeError) {
        throw err;
      }
      throw new Error(
        `SQLiteClient: failed to connect to database: ${this.name}`
      );
    }
  }
}
