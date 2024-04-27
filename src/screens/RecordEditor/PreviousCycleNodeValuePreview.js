import { DataEntrySelectors } from "state";
import { NodeValuePreview } from "./NodeValuePreview";

export const PreviousCycleNodeValuePreview = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log("rendering PreviousCycleNodeValuePreview");
  }

  const { previousCycleEntityUuid } = DataEntrySelectors.useCurrentPageEntity();

  const previousCycleValue =
    DataEntrySelectors.usePreviousCycleRecordAttributeValue({
      nodeDef,
      parentNodeUuid: previousCycleEntityUuid,
    });

  return <NodeValuePreview nodeDef={nodeDef} value={previousCycleValue} />;
};
