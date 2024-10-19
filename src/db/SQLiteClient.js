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

  async executeSql(sql, args) {
    return new Promise((resolve, reject) => {
      this.privateDb.transaction(
        (tx) =>
          tx.executeSql(
            sql,
            args,
            (_, { rows, insertId, rowsAffected }) =>
              resolve({ rows, insertId, rowsAffected }),
            (_, err) => reject(err)
          ),
        reject
      );
    });
  }

  async transaction(callback) {
    return new Promise((resolve, reject) => {
      this.privateDb.transaction(callback, reject, resolve);
    });
  }

  async one(sql, args) {
    const { rows } = await this.executeSql(sql, args);
    return rows.length === 1 ? rows.item(0) : null;
  }

  async many(sql, args) {
    const { rows } = await this.executeSql(sql, args);
    return rows._array;
  }

  async connect() {
    if (this.privateConnected) {
      return { dbMigrationsRun: false };
    }
    try {
      console.log("=== DB connection start ===");

      this.privateDb = SQLite.openDatabase(this.name);

      // MIGRATIONS
      const { rows } = await this.executeSql("PRAGMA user_version");
      const prevDbVersion = rows.item(0).user_version;
      const nextDbVersion = this.migrations.length;
      if (prevDbVersion > nextDbVersion) {
        throw new DowngradeError();
      }
      console.log("==== DB migrations start ====");
      for (let i = prevDbVersion; i < nextDbVersion; i += 1) {
        const migration = this.migrations[i];
        try {
          await migration(this);
        } catch (error) {
          throw error;
        }
      }
      console.log("==== DB migrations complete ====");

      const dbMigrationsRun = prevDbVersion !== nextDbVersion;
      if (dbMigrationsRun) {
        await this.executeSql(`PRAGMA user_version = ${nextDbVersion}`);
      }

      this.privateConnected = true;
      console.log("=== DB connection complete ===");
      return { dbMigrationsRun, prevDbVersion, nextDbVersion };
    } catch (error) {
      console.log(error);
      if (error instanceof DowngradeError) {
        throw error;
      }
      throw new Error(
        `SQLiteClient: failed to connect to database: ${this.name} details: ${error}`
      );
    }
  }
}
