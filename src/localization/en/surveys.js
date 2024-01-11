export default {
  confirmDeleteSurvey: {
    title: "Delete survey",
    message: "Delete the selected survey?",
    message_other: "Delete the selected surveys?",
  },
  currentSurvey: "Current survey",
  errorFetchingSurveys: "Error fetching surveys from remote server",
  errorFetchingSurveysWithDetails:
    "$t(surveys:errorFetchingSurveys): {{details}}",
  importSurvey: "Import survey",
  importSurveyConfirmMessage: 'Import the survey "{{surveyName}}"?',
  importSurveyFromCloud: "Import survey from cloud",
  loadSurveysErrorMessage:
    "Error fetching surveys from remote server.\n\nUser not logged in or session expired.\n\nLogin to the server?",
  manageSurveys: "Manage surveys",
  noAvailableSurveysFound: "No available surveys found",
  noSurveysMatchYourSearch: "No surveys match your search",
  selectSurvey: "Select a survey",
  surveysInTheCloud: "Surveys in the cloud",
  surveysInTheDevice: "Surveys in the device",
  updateStatus: {
    error: "Error retrieving survey update status",
    networkNotAvailable:
      "Cannot verify survey udpate status: network not available",
    upToDate: "Survey up-to-date",
  },
  updateSurvey: "Update survey",
  updateSurveyWithNewVersionConfirmMessage:
    'Survey "{{surveyName}}" has a new version; update it?',
  updateSurveyConfirmMessage:
    'Survey "{{surveyName}}" already in this device; update it?',
};
