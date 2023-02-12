export const migration_001_base = async (client) => {
  await client.transaction((tx) => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS survey (
        id          INTEGER         PRIMARY KEY AUTOINCREMENT,
        uuid        CHAR(16)        NOT NULL,
        server_url  VARCHAR(255)    NOT NULL,
        name        VARCHAR(255)    NOT NULL,
        label       VARCHAR(255),
        content     TEXT            NOT NULL,
        date_created    TIMESTAMP   NOT NULL,
        date_modified   TIMESTAMP   NOT NULL
    );`);

    tx.executeSql(`CREATE TABLE IF NOT EXISTS record (
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
        date_modified   TIMESTAMP     NOT NULL
    );`);
  });
};
