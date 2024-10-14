export const migration_001_base = async (dbClient) => {
  await dbClient.transaction(async () => {
    await dbClient.executeSql(`CREATE TABLE IF NOT EXISTS survey (
        id          INTEGER         PRIMARY KEY AUTOINCREMENT,
        uuid        CHAR(16)        NOT NULL,
        server_url  VARCHAR(255),
        remote_id   INTEGER,
        name        VARCHAR(255)    NOT NULL,
        label       VARCHAR(255),
        content     TEXT            NOT NULL,
        date_created    TIMESTAMP   NOT NULL,
        date_modified   TIMESTAMP   NOT NULL
    );`);

    await dbClient.executeSql(`CREATE TABLE IF NOT EXISTS record (
        id              INTEGER       PRIMARY KEY AUTOINCREMENT,
        uuid            CHAR(16)      NOT NULL,
        survey_id       VARCHAR(255)  NOT NULL,
        key1            TEXT,
        key2            TEXT,
        key3            TEXT,
        key4            TEXT,
        key5            TEXT,
        content         TEXT          NOT NULL,
        date_created    TIMESTAMP     NOT NULL,
        date_modified   TIMESTAMP     NOT NULL,

        CONSTRAINT fk_survey_id
          FOREIGN KEY (survey_id)
          REFERENCES survey (id)
    );`);
  });
};
