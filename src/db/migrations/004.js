export const migration_004 = async (client) => {
  await client.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE record ADD merged_into_record_uuid CHAR(16) NULL;`
    );
  });
};
