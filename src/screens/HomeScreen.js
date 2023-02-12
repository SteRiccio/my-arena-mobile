import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button, VView } from "../components";
import { screens } from "../navigation/AppStack";
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

  const onRecordsListPress = () => {
    navigation.navigate(screens.recordsList.key);
  };

  return (
    <VView>
      <Button onPress={onRecordsListPress}>Records List</Button>
      <Button onPress={onNewRecordPress}>New Record</Button>
    </VView>
  );
};
