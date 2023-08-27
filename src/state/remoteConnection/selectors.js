import { useSelector } from "react-redux";

const getRemoteConnectionState = (state) => state.remoteConnection;

const selectLoggedUser = (state) => getRemoteConnectionState(state).user;

export const RemoteConnectionSelectors = {
  selectLoggedUser,

  useLoggedInUser: () => useSelector(selectLoggedUser),
};
