export default {
  confirmGoToListOfRecordsAndTerminateRecordEditing:
    "Go to list of records and terminate record editing?",
  checkSyncStatus: "Check sync status",
  cycleForNewRecords: "Cycle for new records:",
  options: "Data entry options",
  errorFetchingRecordsSyncStatus:
    "Error fetching records sync status: {{details}}",
  errorGeneratingRecordsExportFile:
    "Error generating records export file: {{details}}",
  exportData: "Export data",
  exportAllRecordsLocally: "Export all records locally",
  exportNewOrUpdatedRecords: "Export new or updated records",
  formLanguage: "Form language:",
  goToDataEntry: "Go to data entry",
  goToListOfRecords: "Go to list of records",
  gpsLockingEnabledWarning: "Warning: GPS locking enabled!",
  listOfRecords: "List of records",
  newRecord: "New record",
  noRecordsFound: "No records found",
  recordEditor: "Record editor",
  syncStatusHeader: "Status",
  syncStatus: {
    keysNotSpecified: `Key attributes not specified`,
    new: "New (not uploaded yet)",
    notModified: "Not modified (no changes to upload)",
    modifiedLocally: "Modified locally",
    modifiedRemotely: "Modified in remote server",
    notInEntryStepAnymore:
      "Not in entry step anymore (in cleansing or analysis step)",
  },

  validationReport: {
    title: "Validation report",
    noErrorsFound: "Kudos, no errors found!",
  },

  viewModeLabel: "View mode",
  viewMode: {
    form: "Form",
    oneNode: "One node",
  },

  code: {
    selectItem: "Select item",
    selectItem_plural: "Select items",
  },
  coordinate: {
    accuracy: "Accuracy (m)",
    angleToTargetLocation: "Angle to target",
    currentLocation: "Current location",
    distance: "Distance (m)",
    altitude: "Altitude (m)",
    altitudeAccuracy: "Altitude accuracy (m)",
    heading: "Heading (deg)",
    magnetometerNotAvailable: "Magnetometer not available!",
    navigateToTarget: "Navigate to target",
    startGPS: "Start GPS",
    stopGPS: "Stop GPS",
    useCurrentLocation: "Use current location",
    x: "X",
    y: "Y",
  },
  taxon: {
    search: "Search taxon",
    taxonNotSelected: "--- Taxon not selected ---",
  },
  fileAttributeImage: {
    chooseAPicture: "Choose a picture",
    pictureDeleteConfirmMessage: "Delete the existing picture?",
    pictureDeleteAndTakeNewOneConfirmMessage:
      "Delete the existing picture and take a new one?",
    pictureResizedToSize: "Picture resized to {{size}}",
  },
  dataExport: {
    error: "Error exporting data. Details: {{details}}",
    selectTarget: "Select export target",
    selectTargetMessage: `Export file size: {{fileSize}}.
Select the target of the export:`,
    target: {
      remote: "Remote server",
      local: "Local folder (Download)",
      share: "Share file",
    },
    shareExportedFile: "Share exported file",
  },
};
