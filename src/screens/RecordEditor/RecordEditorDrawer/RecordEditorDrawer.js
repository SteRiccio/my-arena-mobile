import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Button, CloseIconButton, HView, Text, View } from "components";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { PagesNavigationTree } from "../PagesNavigationTree";

import styles from "./styles";

export const RecordEditorDrawer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const survey = SurveySelectors.useCurrentSurvey();
  const pageSelectorOpen = DataEntrySelectors.useIsRecordPageSelectorMenuOpen();

  if (!pageSelectorOpen) return null;

  return (
    <View style={styles.pagesNavigatorContainer}>
      <HView>
        <Text
          variant="headlineMedium"
          style={styles.titleText}
          textKey={survey.props.name}
        />
        <CloseIconButton
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
          style={styles.closeButton}
        />
      </HView>
      <PagesNavigationTree />
      <Button
        icon="format-list-bulleted"
        textKey="List of records"
        onPress={() =>
          dispatch(DataEntryActions.navigateToRecordsList({ navigation }))
        }
      />
    </View>
  );
};
