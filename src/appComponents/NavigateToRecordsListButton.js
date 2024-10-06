import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { Button } from "components/Button";
import { DataEntryActions } from "state/dataEntry";

const style = { alignSelf: "flex-start" };

export const NavigateToRecordsListButton = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Button
      avoidMultiplePress={false}
      icon="format-list-bulleted"
      onPress={() =>
        dispatch(DataEntryActions.navigateToRecordsList({ navigation }))
      }
      style={style}
      textKey="dataEntry:listOfRecords"
    />
  );
};
