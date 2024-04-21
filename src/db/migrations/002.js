export const migration_002 = async (client) => {
  await client.transaction((tx) => {
    tx.executeSql(`ALTER TABLE record ADD cycle VARCHAR(3);`);
    tx.executeSql(`ALTER TABLE record ADD owner_uuid CHAR(16)`);
    tx.executeSql(
      `ALTER TABLE record ADD load_status CHAR(1) NOT NULL DEFAULT 'C';`
    );
  });
};
