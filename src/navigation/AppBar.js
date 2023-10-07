import { useCallback, useState } from "react";
import { Appbar as RNPAppbar, Divider, Menu } from "react-native-paper";
import { useDispatch } from "react-redux";

import { useTranslation } from "localization";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { screenKeys } from "screens";
import { Breadcrumbs } from "screens/RecordEditor/Breadcrumbs";

export const AppBar = (props) => {
  const { back, navigation, options } = props;

  const { t } = useTranslation();

  const { hasBack, surveyNameAsTitle, title: titleOption } = options;

  const navigationState = navigation.getState();
  const { index, routes } = navigationState;
  const currentScreenKey = routes[index].name;

  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const editingRecord =
    DataEntrySelectors.useIsEditingRecord() &&
    currentScreenKey === screenKeys.recordEditor;

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

      {!editingRecord && currentScreenKey !== screenKeys.settings && (
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
