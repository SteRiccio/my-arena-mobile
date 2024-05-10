export default {
  confirmGoToListOfRecordsAndTerminateRecordEditing:
    "Go to list of records and terminate record editing?",
  checkSyncStatus: "Check sync status",
  closestSamplingPoint: {
    findClosestSamplingPoint: "Find closest sampling point",
    findingClosestSamplingPoint: "Finding closest sampling point",
    minDistanceItemFound: "Item found at a distance of {{minDistance}}m",
    minDistanceItemFound_plural:
      "Items found at a distance of {{minDistance}}m",
    useSelectedItem: "Use selected item",
  },
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
  records: {
    deleteRecordsConfirm: {
      title: "Delete records",
      message: "Delete the selected records?",
    },
    downloadRecords: {
      title: "Download records",
    },
    origin: "Origin",
  },
  showOnlyLocalRecords: "Show only local records",
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
  fileAttribute: {
    chooseAudio: "Choose an audio file",
    chooseFile: "Choose a file",
    choosePicture: "Choose a picture",
    chooseVideo: "Choose a video",
    deleteConfirmMessage: "Delete the existing file?",
  },
  fileAttributeImage: {
    imagePreview: "Image preview",
    pictureResizedToSize: "Picture resized to {{size}}",
    resolution: "Resolution",
  },
  dataExport: {
    error: "Error exporting data. Details: {{details}}",
    selectTarget: "Select export target",
    selectTargetMessage: `Select the target of the export:`,
    target: {
      remote: "Remote server",
      local: "Local folder (Download)",
      share: "Share file",
    },
    shareExportedFile: "Share exported file",
  },
  location: {
    gettingCurrentLocation: "Getting current location",
    usingCurrentLocation: "Using current location",
  },
};
