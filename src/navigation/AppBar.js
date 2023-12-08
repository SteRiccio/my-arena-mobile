import { useCallback, useState } from "react";
import { Appbar as RNPAppbar, Divider, Menu } from "react-native-paper";
import { useDispatch } from "react-redux";

import { useScreenKey } from "hooks";
import { ScreenViewMode } from "model";
import { useTranslation } from "localization";
import {
  DataEntryActions,
  DataEntrySelectors,
  ScreenOptionsActions,
  ScreenOptionsSelectors,
  SurveySelectors,
} from "state";
import { screenKeys } from "screens";
import { Breadcrumbs } from "screens/RecordEditor/Breadcrumbs";

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
    <RNPAppbar.Header>
      {editingRecord && (
        <RNPAppbar.Action
          icon="menu"
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
        />
      )}

      {hasBack && back && <RNPAppbar.BackAction onPress={navigation.goBack} />}

      {editingRecord && <Breadcrumbs />}

      {!editingRecord && <RNPAppbar.Content title={title} />}

      {!editingRecord && hasToggleScreenView && (
        <RNPAppbar.Action
          icon={screenViewMode === ScreenViewMode.list ? "table" : "view-list"}
          onPress={() =>
            dispatch(ScreenOptionsActions.toggleScreenViewMode({ screenKey }))
          }
        />
      )}

      {!editingRecord && screenKey !== screenKeys.settings && (
        <Menu
          visible={menuVisible}
          onDismiss={toggleMenu}
          anchor={
            <RNPAppbar.Action icon="dots-vertical" onPress={toggleMenu} />
          }
        >
          <Menu.Item
            onPress={() => {
              navigation.navigate(screenKeys.surveysListLocal);
              toggleMenu();
            }}
            title="Surveys"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              navigation.navigate(screenKeys.settings);
              toggleMenu();
            }}
            title="Settings"
          />
        </Menu>
      )}
    </RNPAppbar.Header>
  );
};
