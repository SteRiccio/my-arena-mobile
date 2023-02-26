import { Appbar as RNPAppbar } from "react-native-paper";
import { useDispatch } from "react-redux";

import { DataEntryActions } from "../state/dataEntry/actions";
import { DataEntrySelectors } from "../state/dataEntry/selectors";
import { screenKeys } from "./screenKeys";

export const AppBar = (props) => {
  const { back, navigation } = props;

  const dispatch = useDispatch();
  const editingRecord = DataEntrySelectors.useIsEditingRecord();

  return (
    <RNPAppbar.Header>
      {editingRecord && (
        <RNPAppbar.Action
          icon="menu"
          onPress={() => dispatch(DataEntryActions.toggleRecordPageMenuOpen)}
        />
      )}
      {back && <RNPAppbar.BackAction onPress={navigation.goBack} />}
      <RNPAppbar.Content title="My Arena Mobile" />
      <RNPAppbar.Action icon="magnify" onPress={() => {}} />
      <RNPAppbar.Action
        icon="menu"
        onPress={() => navigation.navigate(screenKeys.settings)}
      />
    </RNPAppbar.Header>
  );
};
