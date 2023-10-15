import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Surveys } from "@openforis/arena-core";

import {
  Button,
  CloseIconButton,
  Dropdown,
  HView,
  IconButton,
  Text,
  View,
} from "components";
import { RecordEditViewMode } from "model";
import { screenKeys } from "screens/screenKeys";
import {
  DataEntryActions,
  DataEntrySelectors,
  SurveyOptionsActions,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";
import { PagesNavigationTree } from "../PagesNavigationTree";
import { PageNodesList } from "../PageNodesList";

import { useStyles } from "./styles";

export const RecordEditorDrawer = () => {
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

      <Button
        icon="alert"
        textKey="dataEntry:validationReport.title"
        onPress={() => navigation.navigate(screenKeys.recordValidationReport)}
      />

      <Dropdown
        items={Object.values(RecordEditViewMode).map((mode) => ({
          value: mode,
          label: `dataEntry:viewMode.${mode}`,
        }))}
        label="dataEntry:viewModeLabel"
        onChange={(value) =>
          dispatch(SurveyOptionsActions.selectRecordEditViewMode(value))
        }
        value={viewMode}
      />
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
