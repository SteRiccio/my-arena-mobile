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

      const { dbMigrationsRun, prevDbVersion, nextDbVersion } =
        await this.runMigrationsIfNecessary();

      this.privateConnected = true;
      console.log("=== DB connection complete ===");
      return { dbMigrationsRun, prevDbVersion, nextDbVersion };
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

  async runMigrationsIfNecessary() {
    const dbUserVersionRow = await this.one("PRAGMA user_version");
    const prevVersion = dbUserVersionRow.user_version;
    console.log(`==== current DB version: ${prevVersion}`);
    const nextVersion = this.migrations.length;
    console.log(`==== next DB version: ${nextVersion}`);
    if (prevVersion > nextVersion) {
      throw new DowngradeError();
    }
    const dbMigrationsNecessary = prevVersion !== nextVersion;
    if (dbMigrationsNecessary) {
      const migrationsToRun = this.migrations.slice(prevVersion, nextVersion);
      console.log("==== DB migrations start ====");
      for await (const migration of migrationsToRun) {
        await migration(this);
      }
      console.log("==== DB migrations complete ====");
      await this.executeSql(`PRAGMA user_version = ${nextVersion}`);
    }
    return {
      dbMigrationsRun: dbMigrationsNecessary,
      prevDbVersion: prevVersion,
      nextDbVersion: nextVersion,
    };
  }
}
