import { NodeDefs, Records, Surveys } from "@openforis/arena-core";

const getNodeName = ({ survey, record, nodeUuid }) => {
  const node = Records.getNodeByUuid(nodeUuid)(record);
  if (node) {
    const nodeDef = Surveys.getNodeDefByUuid({
      survey,
      uuid: node.nodeDefUuid,
    });
    return NodeDefs.getName(nodeDef);
  }
  return null;
};

export const RecordNodes = {
  getNodeName,
};
