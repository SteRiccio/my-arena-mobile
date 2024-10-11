export const migration_003 = async (dbClient) => {
  await dbClient.transaction(async () => {
    await dbClient.executeSql(
      `ALTER TABLE record ADD date_modified_remote TIMESTAMP NULL;`
    );
    await dbClient.executeSql(
      `ALTER TABLE record ADD date_synced TIMESTAMP NULL;`
    );
    await dbClient.executeSql(
      `ALTER TABLE record ADD origin CHAR(1) NOT NULL DEFAULT 'L';`
    );
    await dbClient.executeSql(
      `ALTER TABLE record ADD owner_name VARCHAR(255) NULL;`
    );
  });
};
