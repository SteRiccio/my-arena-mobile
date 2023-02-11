// import SQLite from "react-native-sqlite-storage";
import * as SQLite from "expo-sqlite";

// SQLite.enablePromise(true);

/** Database downgrade error */
export class DowngradeError extends Error {
  constructor() {
    super();
    this.name = "DowngradeError";
  }
}

/** Interface to SQLiteClient client. */
export default class SQLiteClient {
  constructor(name, migrations, debug = false) {
    this.name = name;
    this.migrations = migrations;
    this.privateDb = null;
    this.privateConnected = false;

    // if (debug === true) {
    //   SQLite.DEBUG(debug);
    // }
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
            (_, { rows }) => resolve(rows),
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
    const rows = await this.executeSql(sql, args);
    return rows.length === 1 ? rows.item(0) : null;
  }

  async many(sql, args) {
    const rows = await this.executeSql(sql, args);
    return rows._array;
  }

  async connect() {
    if (this.privateConnected) {
      return;
    }
    try {
      console.log("=== DB connection start ===");

      // this.privateDb = await SQLite.openDatabase({
      //   name: this.name,
      //   location: "default",
      // });

      this.privateDb = SQLite.openDatabase(this.name);

      // MIGRATIONS
      const resultSet = await this.executeSql("PRAGMA user_version");
      const version = resultSet.item(0).user_version;
      const nextVersion = this.migrations.length;
      if (version > nextVersion) {
        throw new DowngradeError();
      }
      console.log("==== DB migrations starting ====");
      for (let i = version; i < nextVersion; i += 1) {
        const migration = this.migrations[i];
        await migration(this);
      }
      console.log("==== DB migrations complete ====");

      if (version !== nextVersion) {
        await this.executeSql(`PRAGMA user_version = ${nextVersion}`);
      }

      this.privateConnected = true;
      console.log("=== DB connection complete ===");
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
