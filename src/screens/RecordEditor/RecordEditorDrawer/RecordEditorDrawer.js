import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  Button,
  CloseIconButton,
  HView,
  SegmentedButtons,
  Text,
  View,
} from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { PagesNavigationTree } from "../PagesNavigationTree";

import { useStyles } from "./styles";
import { RecordEditViewMode } from "model/RecordEditViewMode";

export const RecordEditorDrawer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();
  const viewMode = DataEntrySelectors.useRecordEditViewMode();
  const styles = useStyles();

  if (!pageSelectorOpen) return null;

  return (
    <View style={styles.pagesNavigatorContainer}>
      <HView style={styles.titleContainer}>
        <Text
          variant="headlineMedium"
          style={styles.titleText}
          textKey={survey.props.name}
        />
        <CloseIconButton
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
          style={styles.closeButton}
          size={26}
        />
      </HView>
      <PagesNavigationTree />
      <Button
        icon="format-list-bulleted"
        textKey="dataEntry:listOfRecords"
        onPress={() =>
          dispatch(DataEntryActions.navigateToRecordsList({ navigation }))
        }
      />
      <SegmentedButtons
        buttons={Object.values(RecordEditViewMode).map((mode) => ({
          value: mode,
          label: `dataEntry:viewMode.${mode}`,
        }))}
        onChange={(value) =>
          dispatch(DataEntryActions.selectRecordEditViewMode(value))
        }
        value={viewMode}
      />
    </View>
  );
};
