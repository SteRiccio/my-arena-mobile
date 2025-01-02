export default {
  cloneRecords: {
    title: "Клонировать",
    confirm: {
      message:
        "Клонировать выбранные {{recordsCount}} записи в цикл {{cycle}}?",
    },
    onlyRecordsImportedInDeviceOrModifiedLocallyCanBeCloned:
      "Только записи, импортированные на устройство или измененные локально, могут быть клонированы в следующий цикл",
    completeSuccessfully: "Записи успешно клонированы в цикл {{cycle}}!",
  },
  confirmImportRecordFromServer: "Импортировать запись с сервера?",
  dateModifiedRemotely: "Дата изменения на удаленном сервере",
  deleteRecordsConfirm: {
    title: "Удалить записи",
    message: "Удалить выбранные записи?",
  },
  duplicateKey: {
    title: "Дубликат ключа",
    message: "Другая запись с таким же ключом ({{keyValues}}) уже существует.",
  },
  exportRecords: {
    title: "Экспорт",
  },
  importRecord: "Импортировать запись",
  importRecords: {
    title: "Импорт с сервера",
  },
  importRecordsFromFile: {
    title: "Импорт",
    confirmMessage: "Импортировать записи из выбранного файла\n{{fileName}}?",
    invalidFileType: "Неверный тип файла (ожидается .zip)",
    overwriteExistingRecords: "Перезаписать существующие записи",
    selectFile: "Выберите файл",
  },
  importCompleteSuccessfully:
    "Импорт записей успешно завершен!\n- Обработано {{processedRecords}} записей\n- Вставлено {{insertedRecords}} записей\n- Обновлено {{updatedRecords}} записей",
  importFailed: "Ошибка импорта записей: {{details}}",
  loadStatus: {
    title: "Загружено",
    C: "Полностью",
    P: "Частично (без файлов)",
    S: "Только сводка",
  },
  origin: {
    title: "Источник",
    L: "Локальный",
    R: "Удаленный",
  },
  owner: "Владелец",
};
