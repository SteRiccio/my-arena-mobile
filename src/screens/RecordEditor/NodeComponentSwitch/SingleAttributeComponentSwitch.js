import React from "react";
import { NodeDefType } from "@openforis/arena-core";

import { DataEntrySelectors } from "../../../state/dataEntry/selectors";

import { Text } from "../../../components";

import { NodeBooleanComponent } from "./nodeTypes/NodeBooleanComponent";
import { NodeCodeComponent } from "./nodeTypes/NodeCodeComponent";
import { NodeTextComponent } from "./nodeTypes/NodeTextComponent";
import { NodeDateComponent } from "./nodeTypes/NodeDateComponent";
import { NodeTimeComponent } from "./nodeTypes/NodeTimeComponent";

const nodeDefComponentByType = {
  [NodeDefType.boolean]: NodeBooleanComponent,
  [NodeDefType.code]: NodeCodeComponent,
  [NodeDefType.date]: NodeDateComponent,
  [NodeDefType.decimal]: NodeTextComponent,
  [NodeDefType.integer]: NodeTextComponent,
  [NodeDefType.text]: NodeTextComponent,
  [NodeDefType.time]: NodeTimeComponent,
};

export const SingleAttributeComponentSwitch = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  const component = nodeDefComponentByType[nodeDef.type];

  const nodeUuid = DataEntrySelectors.useRecordSingleNodeUuid({
    parentNodeUuid,
    nodeDefUuid: nodeDef.uuid,
  });

  return component ? (
    React.createElement(component, {
      nodeDef,
      nodeUuid,
    })
  ) : (
    <Text textKey={`Type not supported (${nodeDef.type})`} />
  );
};
