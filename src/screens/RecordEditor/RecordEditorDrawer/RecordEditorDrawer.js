import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Surveys } from "@openforis/arena-core";

import {
  Button,
  CloseIconButton,
  HView,
  IconButton,
  Text,
  View,
} from "components";
import { GpsLockingEnabledWarning } from "appComponents/GpsLockingEnabledWarning";
import { RecordEditViewMode } from "model";
import { screenKeys } from "screens/screenKeys";
import {
  DataEntryActions,
  DataEntrySelectors,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";
import { PagesNavigationTree } from "../PagesNavigationTree";
import { PageNodesList } from "../PageNodesList";

import { useStyles } from "./styles";

export const RecordEditorDrawer = () => {
  if (__DEV__) {
    console.log(`rendering RecordEditorDrawer`);
  }
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const langCode = SurveySelectors.useCurrentSurveyPreferredLang();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = SurveyOptionsSelectors.useRecordEditViewMode();
  const styles = useStyles();

  if (!pageSelectorOpen) return null;

  return (
    <View style={styles.pagesNavigatorContainer}>
      <HView style={styles.titleContainer}>
        <Text
          numberOfLines={1}
          variant="headlineMedium"
          style={styles.titleText}
          textKey={
            Surveys.getLabel(langCode)(survey) || Surveys.getName(survey)
          }
        />
        <CloseIconButton
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
          style={styles.closeButton}
          size={26}
        />
      </HView>

      {viewMode === RecordEditViewMode.oneNode ? (
        <PageNodesList />
      ) : (
        <PagesNavigationTree />
      )}

      <GpsLockingEnabledWarning />

      <HView style={styles.buttonBar} transparent>
        <Button
          icon="format-list-bulleted"
          textKey="dataEntry:listOfRecords"
          onPress={() =>
            dispatch(DataEntryActions.navigateToRecordsList({ navigation }))
          }
        />
        <IconButton
          icon="cog"
          onPress={() => navigation.navigate(screenKeys.settings)}
        />
      </HView>
    </View>
  );
};
