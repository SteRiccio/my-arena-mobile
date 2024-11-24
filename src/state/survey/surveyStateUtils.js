import { Surveys } from "@openforis/arena-core";

import { SystemUtils } from "utils/SystemUtils";

export const determinePreferredSurveyLanguage = (survey) => {
  if (!survey) return null;
  const systemLang = SystemUtils.getLanguageCode();
  const surveyLanguages = Surveys.getLanguages(survey);
  return surveyLanguages.includes(systemLang) ? systemLang : surveyLanguages[0];
};
