import { useCallback, useState } from "react";
import { Appbar as RNPAppbar, Divider, Menu } from "react-native-paper";
import { useDispatch } from "react-redux";

import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { screenKeys } from "screens";
import { Breadcrumbs } from "screens/RecordEditor/Breadcrumbs";

export const AppBar = (props) => {
  const { back, navigation, options } = props;
  const { hasBack, surveyNameAsTitle, title: titleOption } = options;

  const navigationState = navigation.getState();
  const { index, routes } = navigationState;
  const currentScreenKey = routes[index].name;

  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const editingRecord = DataEntrySelectors.useIsEditingRecord();

  const [state, setState] = useState({ menuVisible: false });

  const { menuVisible } = state;

  const title =
    surveyNameAsTitle && editingRecord && survey
      ? survey.props.name
      : titleOption;

  const toggleMenu = useCallback(
    () =>
      setState((statePrev) => ({ ...statePrev, menuVisible: !menuVisible })),
    [menuVisible]
  );

  return (
    <RNPAppbar.Header>
      {editingRecord && currentScreenKey === screenKeys.recordEditor && (
        <RNPAppbar.Action
          icon="menu"
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
        />
      )}

      {hasBack && back && <RNPAppbar.BackAction onPress={navigation.goBack} />}

      {currentScreenKey === screenKeys.recordEditor && <Breadcrumbs />}

      {currentScreenKey !== screenKeys.recordEditor && (
        <RNPAppbar.Content title={title} />
      )}

      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={<RNPAppbar.Action icon="dots-vertical" onPress={toggleMenu} />}
      >
        <Menu.Item
          onPress={() => {
            navigation.navigate(screenKeys.login);
            toggleMenu();
          }}
          title="Login"
        />
        <Divider />
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
    </RNPAppbar.Header>
  );
};
