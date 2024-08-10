import { DataEntrySelectors, SurveySelectors } from "state";

import { NodeValuePreview } from "./CurrentRecordNodeValuePreview";
import { NodeValuePreviewPropTypes } from "./NodeValuePreview/NodeValuePreviewPropTypes";

export const CurrentRecordNodeValuePreview = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log("rendering CurrentRecordNodeValuePreview");
  }

  const { value: nodeValue } = DataEntrySelectors.useRecordAttributeInfo({
    nodeUuid,
  });
  const isRootDef = SurveySelectors.useIsNodeDefRootKey(nodeDef);

  if (isRootDef) {
    return null;
  }

  return <NodeValuePreview nodeDef={nodeDef} value={previousCycleValue} />;
};

CurrentRecordNodeValuePreview.propTypes = NodeValuePreviewPropTypes;
