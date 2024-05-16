import { useCallback, useState } from "react";
import { IconButton, Appbar as RNPAppbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { HView, Spacer, Text } from "components";
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
  const canRecordBeLinkedToPreviousCycle =
    DataEntrySelectors.useCanRecordBeLinkedToPreviousCycle();
  const isLinkedToPreviousCycleRecord =
    DataEntrySelectors.useIsLinkedToPreviousCycleRecord();

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

  return (
    <RNPAppbar.Header elevated mode={editingRecord ? "medium" : "small"}>
      <HView fullWidth transparent>
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
            {recordEditViewMode === RecordEditViewMode.form && (
              <RNPAppbar.Action
                icon="numeric-1-box-outline"
                onPress={() =>
                  dispatch(
                    SurveyOptionsActions.setRecordEditViewMode(
                      RecordEditViewMode.oneNode
                    )
                  )
                }
              />
            )}
            {recordEditViewMode === RecordEditViewMode.oneNode && (
              <RNPAppbar.Action
                icon="format-list-bulleted"
                onPress={() =>
                  dispatch(
                    SurveyOptionsActions.setRecordEditViewMode(
                      RecordEditViewMode.form
                    )
                  )
                }
              />
            )}
            {canRecordBeLinkedToPreviousCycle && (
              <RNPAppbar.Action
                icon={isLinkedToPreviousCycleRecord ? "link" : "link-off"}
                onPress={() =>
                  dispatch(
                    isLinkedToPreviousCycleRecord
                      ? DataEntryActions.unlinkFromRecordInPreviousCycle()
                      : DataEntryActions.linkToRecordInPreviousCycle()
                  )
                }
              />
            )}
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
