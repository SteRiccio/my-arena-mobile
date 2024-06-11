export const migration_003 = async (client) => {
  await client.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE record ADD date_modified_remote TIMESTAMP NULL;`
    );
    tx.executeSql(`ALTER TABLE record ADD date_synced TIMESTAMP NULL;`);
    tx.executeSql(
      `ALTER TABLE record ADD origin CHAR(1) NOT NULL DEFAULT 'L';`
    );
    tx.executeSql(`ALTER TABLE record ADD owner_name VARCHAR(255) NULL;`);
  });
};
