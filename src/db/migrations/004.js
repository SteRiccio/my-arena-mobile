export const migration_004 = async (dbClient) => {
  await dbClient.transaction(async () => {
    await dbClient.executeSql(
      `ALTER TABLE record ADD merged_into_record_uuid CHAR(16) NULL;`
    );
  });
};
