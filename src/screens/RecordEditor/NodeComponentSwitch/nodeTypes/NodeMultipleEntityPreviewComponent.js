import { useDispatch } from "react-redux";
import { Button, Text, VView } from "../../../../components";
import { DataEntryActions } from "../../../../state/dataEntry/actions";

export const NodeMultipleEntityPreviewComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log("rendering NodeMultipleEntityPreviewComponent");
  }

  const dispatch = useDispatch();

  return (
    <VView>
      <Text>Items: {0}</Text>
      <Button
        label="Edit"
        onPress={() =>
          dispatch(
            DataEntryActions.selectCurrentPageNode({
              nodeDefUuid: nodeDef.uuid,
            })
          )
        }
      />
    </VView>
  );
};
