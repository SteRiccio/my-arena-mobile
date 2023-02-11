import React, { useEffect } from "react";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { SurveyService } from "../service/surveyService";

import { DataEntryActions } from "../state/dataEntry/actions";
import { SurveyActions } from "../state/survey/actions";

export const HomeScreen = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      const surveySummaries = await SurveyService.fetchSurveySummaries();
      const firstSurveyId = surveySummaries[0].id;
      const survey = await SurveyService.fetchSurveyById(firstSurveyId);
      dispatch(SurveyActions.setCurrentSurvey(survey));
    };
    initialize();
  }, []);

  const onNewRecordPress = () => {
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  return <Button onPress={onNewRecordPress}>New Record</Button>;
};
