import React, { useEffect } from "react";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../state/dataEntry/actions";
import { SurveyActions } from "../state/survey/actions";

export const HomeScreen = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SurveyActions.setDemoSurveyAsCurrent());
  }, []);

  const onNewRecordPress = () => {
    dispatch(DataEntryActions.createNewRecord({ navigation }));
  };

  return <Button onPress={onNewRecordPress}>New Record</Button>;
};
