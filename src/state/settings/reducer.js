import { StoreUtils } from "../storeUtils";
import { SettingsActions } from "./actions";

const initialState = { animationsEnabled: true, gpsAccuracyThreshold: 5 };

const actionHandlers = {
  [SettingsActions.SETTINGS_SET]: ({ state, action }) => ({
    ...state,
    ...action.settings,
  }),
};

export const SettingsReducer = StoreUtils.exportReducer({
  actionHandlers,
  initialState,
});
