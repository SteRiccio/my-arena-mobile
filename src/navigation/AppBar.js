import { useCallback, useState } from "react";
import { Appbar as RNPAppbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { HView, IconButton, Spacer, Text } from "components";
import { useScreenKey } from "hooks";
import { RecordEditViewMode, ScreenViewMode } from "model";
import { useTranslation } from "localization";
import {
  DataEntryActions,
  DataEntrySelectors,
  ScreenOptionsActions,
  ScreenOptionsSelectors,
  SurveyOptionsActions,
  SurveyOptionsSelectors,
  SurveySelectors,
} from "state";
import { screenKeys } from "screens";
import { Breadcrumbs } from "screens/RecordEditor/Breadcrumbs";
import { OptionsMenu } from "./OptionsMenu";

import styles from "./styles";

export const AppBar = (props) => {
  const { back, navigation, options } = props;

  const { t } = useTranslation();

  const {
    hasBack,
    hasToggleScreenView,
    surveyNameAsTitle,
    title: titleOption,
  } = options;

  const screenKey = useScreenKey();
  const screenViewMode = ScreenOptionsSelectors.useScreenViewMode(screenKey);

  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const editingRecord =
    DataEntrySelectors.useIsEditingRecord() &&
    screenKey === screenKeys.recordEditor;
  const recordEditViewMode = SurveyOptionsSelectors.useRecordEditViewMode();
  const recordHasErrors = DataEntrySelectors.useRecordHasErrors();

  const [state, setState] = useState({ menuVisible: false });

  const { menuVisible } = state;

  const title =
    surveyNameAsTitle && editingRecord && survey
      ? survey.props.name
      : t(titleOption);

  const toggleMenu = useCallback(
    () =>
      setState((statePrev) => ({ ...statePrev, menuVisible: !menuVisible })),
    [menuVisible]
  );

  const toggleRecordEditViewMode = useCallback(() => {
    dispatch(
      SurveyOptionsActions.setRecordEditViewMode(
        recordEditViewMode === RecordEditViewMode.form
          ? RecordEditViewMode.oneNode
          : RecordEditViewMode.form
      )
    );
  }, [recordEditViewMode]);

  return (
    <RNPAppbar.Header elevated mode={editingRecord ? "medium" : "small"}>
      <HView style={styles.topBarContainer} fullWidth transparent>
        {editingRecord && (
          <RNPAppbar.Action
            icon="menu"
            onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
          />
        )}

        {hasBack && back && (
          <RNPAppbar.BackAction onPress={navigation.goBack} />
        )}

        {!editingRecord && (
          <Text style={styles.title} variant="titleLarge">
            {title}
          </Text>
        )}

        {editingRecord && (
          <>
            <Spacer />
            {recordHasErrors && (
              <IconButton
                icon="alert"
                onPress={() =>
                  navigation.navigate(screenKeys.recordValidationReport)
                }
              />
            )}
            <RNPAppbar.Action
              icon={
                recordEditViewMode === RecordEditViewMode.form
                  ? "numeric-1-box-outline"
                  : "format-list-bulleted"
              }
              onPress={toggleRecordEditViewMode}
            />
          </>
        )}

        {!editingRecord && hasToggleScreenView && (
          <RNPAppbar.Action
            icon={
              screenViewMode === ScreenViewMode.list ? "table" : "view-list"
            }
            onPress={() =>
              dispatch(ScreenOptionsActions.toggleScreenViewMode({ screenKey }))
            }
          />
        )}

        {screenKey !== screenKeys.settings && (
          <OptionsMenu menuVisible={menuVisible} toggleMenu={toggleMenu} />
        )}
      </HView>
      {editingRecord && (
        <RNPAppbar.Content title={<Breadcrumbs />}></RNPAppbar.Content>
      )}
    </RNPAppbar.Header>
  );
};

AppBar.propTypes = {
  back: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};
