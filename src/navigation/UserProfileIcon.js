import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import PropTypes from "prop-types";

import {
  RemoteConnectionActions,
  RemoteConnectionSelectors,
} from "state/remoteConnection";

const determineIconSource = ({ user, uri, loading }) => {
  if (user) {
    if (uri) return { uri };
    if (loading) return "loading";
    return null;
  }
  return "account-off";
};

export const UserProfileIcon = (props) => {
  const { onPress, size = 30 } = props;
  if (__DEV__) console.log(`rendering UserProfileIcon`);

  const dispatch = useDispatch();
  const user = RemoteConnectionSelectors.useLoggedInUser();
  const iconInfo = RemoteConnectionSelectors.useLoggedInUserProfileIconInfo();
  const { loading, uri, loaded } = iconInfo ?? {};

  useEffect(() => {
    if (user && !loaded && !uri) {
      dispatch(RemoteConnectionActions.fetchLoggedInUserProfileIcon);
    }
  }, [dispatch, user, loaded, uri]);

  const userIconSource = determineIconSource({ user, uri, loading });

  const userFirstLetter = user?.name.substring(0, 1).toLocaleUpperCase();

  const avatar = userIconSource ? (
    <Avatar.Image source={userIconSource} size={size} />
  ) : (
    <Avatar.Text label={userFirstLetter} size={size} />
  );
  return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
};

UserProfileIcon.propTypes = {
  onPress: PropTypes.func,
  size: PropTypes.number,
};
