import { useCallback, useState } from "react";
import { Appbar as RNPAppbar, Divider, Menu } from "react-native-paper";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../state/dataEntry/actions";
import { DataEntrySelectors } from "../state/dataEntry/selectors";
import { SurveySelectors } from "../state/survey/selectors";
import { screenKeys } from "./screenKeys";

export const AppBar = (props) => {
  const { back, navigation } = props;

  const dispatch = useDispatch();
  const survey = SurveySelectors.useCurrentSurvey();
  const editingRecord = DataEntrySelectors.useIsEditingRecord();

  const [state, setState] = useState({ menuVisible: false });

  const { menuVisible } = state;

  const toggleMenu = useCallback(
    () =>
      setState((statePrev) => ({ ...statePrev, menuVisible: !menuVisible })),
    [menuVisible]
  );

  return (
    <>
      <RNPAppbar.Header>
        {editingRecord && (
          <RNPAppbar.Action
            icon="menu"
            onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
          />
        )}
        {back && <RNPAppbar.BackAction onPress={navigation.goBack} />}
        <RNPAppbar.Content title={survey?.props.name} />
        <RNPAppbar.Action icon="magnify" onPress={() => {}} />

        <Menu
          visible={menuVisible}
          onDismiss={toggleMenu}
          anchor={
            <RNPAppbar.Action icon="dots-vertical" onPress={toggleMenu} />
          }
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
              navigation.navigate(screenKeys.settings);
              toggleMenu();
            }}
            title="Settings"
          />
        </Menu>
      </RNPAppbar.Header>
    </>
  );
};
