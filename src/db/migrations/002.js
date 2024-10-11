export const migration_002 = async (dbClient) => {
  await dbClient.transaction(async () => {
    await dbClient.executeSql(`ALTER TABLE record ADD cycle VARCHAR(3);`);
    await dbClient.executeSql(`ALTER TABLE record ADD owner_uuid CHAR(16)`);
    await dbClient.executeSql(
      `ALTER TABLE record ADD load_status CHAR(1) NOT NULL DEFAULT 'C';`
    );
  });
};
