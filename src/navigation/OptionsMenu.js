import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Appbar as RNPAppbar, Divider, Menu, Avatar } from "react-native-paper";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import PropTypes from "prop-types";

import { Surveys } from "@openforis/arena-core";

import { useScreenKey } from "hooks";
import { useTranslation } from "localization";
import { screenKeys } from "screens";
import { AuthService } from "service/authService";
import {
  ConfirmActions,
  DataEntryActions,
  DataEntrySelectors,
  RemoteConnectionSelectors,
  SurveySelectors,
} from "state";
import { Environment } from "utils";

const UserProfileIcon = (props) => {
  const { onPress } = props;
  const user = RemoteConnectionSelectors.useLoggedInUser();
  const userUuid = user?.uuid;

  const [iconUri, setIconUri] = useState(null);

  useEffect(() => {
    AuthService.fetchUserPicture(userUuid).then(setIconUri);
  }, [userUuid]);

  const iconSource = iconUri ? { uri: iconUri } : "loading";
  return (
    <RNPAppbar.Action
      icon={iconSource}
      onPress={onPress}
      style={{ borderWidth: 1 }}
    />
  );
};

export const OptionsMenu = (props) => {
  const { toggleMenu, visible } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const user = RemoteConnectionSelectors.useLoggedInUser();
  const screenKey = useScreenKey();
  const editingRecord =
    DataEntrySelectors.useIsEditingRecord() &&
    screenKey === screenKeys.recordEditor;
  const survey = SurveySelectors.useCurrentSurvey();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();
  const fieldManualUrl = survey
    ? Surveys.getFieldManualLink(lang)(survey)
    : null;

  return (
    <Menu
      visible={visible}
      onDismiss={toggleMenu}
      anchor={
        user ? (
          <UserProfileIcon onPress={toggleMenu} />
        ) : (
          <RNPAppbar.Action icon="account-off" onPress={toggleMenu} />
        )
      }
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
        <>
          <Menu.Item
            leadingIcon="view-list"
            onPress={() => {
              toggleMenu();
              dispatch(DataEntryActions.navigateToRecordsList({ navigation }));
            }}
            title={t("dataEntry:listOfRecords")}
          />
          {fieldManualUrl && (
            <Menu.Item
              leadingIcon="help"
              onPress={() => {
                toggleMenu();
                WebBrowser.openBrowserAsync(fieldManualUrl);
              }}
              title={t("surveys:fieldManual")}
            />
          )}
        </>
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
      <Menu.Item
        leadingIcon="information-outline"
        onPress={() => {
          toggleMenu();
          navigation.navigate(screenKeys.about);
        }}
        title={t("common:about")}
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

OptionsMenu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};
