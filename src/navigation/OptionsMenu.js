import { useDispatch } from "react-redux";
import { Appbar as RNPAppbar, Divider, Menu } from "react-native-paper";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useScreenKey } from "hooks";
import { useTranslation } from "localization";
import { screenKeys } from "screens";
import { ConfirmActions, DataEntryActions, DataEntrySelectors } from "state";
import { Environment } from "utils";

export const OptionsMenu = (props) => {
  const { menuVisible, toggleMenu } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const screenKey = useScreenKey();
  const editingRecord =
    DataEntrySelectors.useIsEditingRecord() &&
    screenKey === screenKeys.recordEditor;

  return (
    <Menu
      visible={menuVisible}
      onDismiss={toggleMenu}
      anchor={<RNPAppbar.Action icon="dots-vertical" onPress={toggleMenu} />}
    >
      {!editingRecord && (
        <Menu.Item
          leadingIcon="view-list"
          onPress={() => {
            toggleMenu();
            navigation.navigate(screenKeys.surveysListLocal);
          }}
          title={t("surveys:title")}
        />
      )}
      {editingRecord && (
        <Menu.Item
          leadingIcon="view-list"
          onPress={() => {
            toggleMenu();
            dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
          }}
          title={t("dataEntry:listOfRecords")}
        />
      )}
      <Divider />
      <Menu.Item
        leadingIcon="cog"
        onPress={() => {
          toggleMenu();
          navigation.navigate(screenKeys.settings);
        }}
        title={t("settings:title")}
      />
      {Environment.isAndroid && (
        <Menu.Item
          leadingIcon="exit-to-app"
          onPress={() => {
            toggleMenu();
            dispatch(
              ConfirmActions.show({
                titleKey: "app:confirmExit.title",
                confirmButtonTextKey: "common:exit",
                messageKey: "app:confirmExit.message",
                onConfirm: BackHandler.exitApp,
              })
            );
          }}
          title={t("common:exit")}
        />
      )}
    </Menu>
  );
};
