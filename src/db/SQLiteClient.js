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
    const result = await this.privateDb.runAsync(sql, args);
    const { lastInsertRowId: insertId, changes: rowsAffected } = result;
    return { insertId, rowsAffected };
    // return await this.privateDb.execAsync(sql)
    // return new Promise((resolve, reject) => {
    //   this.privateDb.transaction(
    //     (tx) =>
    //       tx.executeSql(
    //         sql,
    //         args,
    //         (_, { rows, insertId, rowsAffected }) =>
    //           resolve({ rows, insertId, rowsAffected }),
    //         (_, err) => reject(err)
    //       ),
    //     reject
    //   );
    // });
  }

  async transaction(callback) {
    return this.privateDb.withTransactionAsync(callback);
  }

  async one(sql, args) {
    return this.privateDb.getFirstAsync(sql, args);
  }

  async many(sql, args) {
    return this.privateDb.getAllAsync(sql, args);
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
      const nextDbVersion = this.migrations.length;
      if (prevDbVersion > nextDbVersion) {
        throw new DowngradeError();
      }
      console.log("==== DB migrations start ====");
      for (let i = prevDbVersion; i < nextDbVersion; i += 1) {
        const migration = this.migrations[i];
        await migration(this);
      }
      console.log("==== DB migrations complete ====");

      const dbMigrationsRun = prevDbVersion !== nextDbVersion;
      if (dbMigrationsRun) {
        await this.executeSql(`PRAGMA user_version = ${nextDbVersion}`);
      }

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
}
