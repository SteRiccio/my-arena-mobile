export const migration_005 = async (dbClient) => {
  await dbClient.executeSql(`CREATE TABLE record_new (
        id              INTEGER       PRIMARY KEY AUTOINCREMENT,
        uuid            CHAR(16)      NOT NULL,
        survey_id       INTEGER  NOT NULL,
        cycle VARCHAR(3), 
        key1            TEXT,
        key2            TEXT,
        key3            TEXT,
        key4            TEXT,
        key5            TEXT,
        content         TEXT          NOT NULL,
        date_created    TIMESTAMP     NOT NULL,
        date_modified   TIMESTAMP     NOT NULL, 
        date_modified_remote TIMESTAMP NULL, 
        date_synced TIMESTAMP NULL, 
        owner_uuid CHAR(16), 
        owner_name VARCHAR(255) NULL, 
        load_status CHAR(1) NOT NULL DEFAULT 'C', 
        origin CHAR(1) NOT NULL DEFAULT 'L', 
        merged_into_record_uuid CHAR(16) NULL,

        CONSTRAINT fk_survey_id
          FOREIGN KEY (survey_id)
          REFERENCES survey (id)
    );
    
    INSERT INTO record_new (id, uuid, survey_id, cycle, key1, key2, key3, key4, key5, 
      content, date_created, date_modified, date_modified_remote, date_synced,
      owner_uuid, owner_name, load_status, origin, merged_into_record_uuid)
    SELECT id, uuid, (CAST(survey_id AS INTEGER)), cycle, key1, key2, key3, key4, key5, 
      content, date_created, date_modified, date_modified_remote, date_synced,
      owner_uuid, owner_name, load_status, origin, merged_into_record_uuid 
    FROM record;
    
    DROP TABLE record;
    
    ALTER TABLE record_new RENAME TO record;`);
};
