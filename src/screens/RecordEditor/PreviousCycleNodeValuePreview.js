import { CollapsiblePanel } from "components";
import { DataEntrySelectors, SurveySelectors } from "state";

import { NodeValuePreview } from "./NodeValuePreview";
import { NodeValuePreviewPropTypes } from "./NodeValuePreview/NodeValuePreviewPropTypes";

const PreviousCycleNodeValuePreviewInnerComponent = (props) => {
  const { nodeDef } = props;

  const { previousCycleEntityUuid } =
    DataEntrySelectors.usePreviousCycleRecordPageEntity();

  const previousCycleValue =
    DataEntrySelectors.usePreviousCycleRecordAttributeValue({
      nodeDef,
      parentNodeUuid: previousCycleEntityUuid,
    });

  return <NodeValuePreview nodeDef={nodeDef} value={previousCycleValue} />;
};

export const PreviousCycleNodeValuePreview = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log("rendering PreviousCycleNodeValuePreview");
  }

  if (SurveySelectors.useIsNodeDefRootKey(nodeDef)) {
    return null;
  }
  return (
    <CollapsiblePanel headerKey="dataEntry:recordInPreviousCycle.valuePanelHeader">
      <PreviousCycleNodeValuePreviewInnerComponent nodeDef={nodeDef} />
    </CollapsiblePanel>
  );
};

PreviousCycleNodeValuePreview.propTypes = NodeValuePreviewPropTypes;
