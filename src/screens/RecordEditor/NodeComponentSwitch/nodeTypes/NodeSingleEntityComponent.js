import { FieldSet } from "../../../../components/FieldSet";
import { DataEntrySelectors } from "../../../../state/dataEntry/selectors";
import { NodeEntityFormComponent } from "./NodeEntityFormComponent";

export const NodeSingleEntityComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log("rendering NodeSingleEntityComponent");
  }

  const nodeUuid = DataEntrySelectors.useRecordSingleNodeUuid({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });

  if (!nodeUuid) return null;

  return (
    <FieldSet header={nodeDef.props.name}>
      <NodeEntityFormComponent nodeDef={nodeDef} parentNodeUuid={nodeUuid} />
    </FieldSet>
  );
};
