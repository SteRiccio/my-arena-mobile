import React, { useCallback, useEffect, useRef } from "react";
import { ScrollView } from "react-native";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "state";
import { VView } from "components";

import { NodeDefFormItem } from "../../../NodeDefFormItem";

import styles from "./styles";

export const NodeEntityFormComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDefEntityForm for ${NodeDefs.getName(nodeDef)}`);
  }

  const scrollViewRef = useRef(null);

  const childrenDefs = DataEntrySelectors.useRecordEntityChildDefs({ nodeDef });

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [nodeDef, parentNodeUuid]);

  const onFormItemFocus = useCallback((event) => {
    event.target
      ?.getNativeRef?.()
      .measureLayout(scrollViewRef.current, (_x, y, _width, _height) => {
        scrollViewRef.current?.scrollTo({ y: y - 40, animated: true });
      });
  }, []);

  return (
    <ScrollView
      nestedScrollEnabled
      style={styles.container}
      persistentScrollbar
      ref={scrollViewRef}
    >
      <VView>
        {childrenDefs.map((childDef) => (
          <NodeDefFormItem
            key={childDef.uuid}
            nodeDef={childDef}
            parentNodeUuid={parentNodeUuid}
            onFocus={onFormItemFocus}
          />
        ))}
      </VView>
    </ScrollView>
  );
};
