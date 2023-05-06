import React from "react";
import { NodeDefType } from "@openforis/arena-core";

import { DataEntrySelectors } from "state";

import { Text } from "components";

import { NodeBooleanComponent } from "./nodeTypes/NodeBooleanComponent";
import { NodeCodeComponent } from "./nodeTypes/NodeCodeComponent";
import { NodeTextComponent } from "./nodeTypes/NodeTextComponent";
import { NodeDateComponent } from "./nodeTypes/NodeDateComponent";
import { NodeTimeComponent } from "./nodeTypes/NodeTimeComponent";
import { NodeCoordinateComponent } from "./nodeTypes/NodeCoordinateComponent";

const nodeDefComponentByType = {
  [NodeDefType.boolean]: NodeBooleanComponent,
  [NodeDefType.code]: NodeCodeComponent,
  [NodeDefType.coordinate]: NodeCoordinateComponent,
  [NodeDefType.date]: NodeDateComponent,
  [NodeDefType.decimal]: NodeTextComponent,
  [NodeDefType.integer]: NodeTextComponent,
  [NodeDefType.text]: NodeTextComponent,
  [NodeDefType.time]: NodeTimeComponent,
};

export const SingleAttributeComponentSwitch = (props) => {
  const { nodeDef, nodeUuid: nodeUuidProp, parentNodeUuid, style } = props;

  const component = nodeDefComponentByType[nodeDef.type];

  const { nodes } = DataEntrySelectors.useRecordChildNodes({
    parentEntityUuid: parentNodeUuid,
    nodeDef,
  });

  const nodeUuid = nodeUuidProp ? nodeUuidProp : nodes[0]?.uuid;

  return component ? (
    React.createElement(component, {
      nodeDef,
      nodeUuid,
      parentNodeUuid,
      style,
    })
  ) : (
    <Text textKey={`Type not supported (${nodeDef.type})`} />
  );
};
