import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { Button } from "components/Button";
import { DataEntryActions } from "state/dataEntry";

export const NavigateToRecordsListButton = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Button
      avoidMultiplePress={false}
      icon="format-list-bulleted"
      textKey="dataEntry:listOfRecords"
      onPress={() =>
        dispatch(DataEntryActions.navigateToRecordsList({ navigation }))
      }
    />
  );
};
