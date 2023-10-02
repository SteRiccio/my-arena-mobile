import React, { useCallback, useEffect, useRef } from "react";
import { VirtualizedList } from "react-native";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntrySelectors } from "state";

import { View } from "components/View";
import { NodeDefFormItem } from "../../../NodeDefFormItem";

import styles from "./styles";

const Separator = () => <View style={styles.separator} />;

export const NodeEntityFormComponent = (props) => {
  const { nodeDef, parentNodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeDefEntityForm for ${NodeDefs.getName(nodeDef)}`);
  }

  const listRef = useRef(null);

  const childrenDefs = DataEntrySelectors.useRecordEntityChildDefs({ nodeDef });

  useEffect(() => {
    // listRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    listRef.current?.scrollToOffset?.({ offset: 0, animated: false });
  }, [nodeDef, parentNodeUuid]);

  const onFormItemFocus = useCallback((event) => {
    // event?.target
    //   ?.getNativeRef?.()
    //   ?.measureLayout(listRef.current, (_x, y, _width, _height) => {
    //     // listRef.current?.scrollTo({ y: y - 40, animated: true });
    //      listRef.current?.scrollToOffset({ offset: y - 40, animated: true });
    //   });
  }, []);

  return (
    <VirtualizedList
      ref={listRef}
      style={styles.container}
      getItemCount={() => childrenDefs.length}
      getItem={(_data, index) => childrenDefs[index]}
      initialNumToRender={10}
      ItemSeparatorComponent={<Separator />}
      keyExtractor={(childDef) => childDef.uuid}
      renderItem={({ item: childDef }) => (
        <NodeDefFormItem
          key={childDef.uuid}
          nodeDef={childDef}
          parentNodeUuid={parentNodeUuid}
          onFocus={onFormItemFocus}
        />
      )}
    />
    // <ScrollView
    //   nestedScrollEnabled
    //   style={styles.container}
    //   persistentScrollbar
    //   ref={listRef}
    // >
    //   <VView>
    //     {childrenDefs.map((childDef) => (
    //       <NodeDefFormItem
    //         key={childDef.uuid}
    //         nodeDef={childDef}
    //         parentNodeUuid={parentNodeUuid}
    //         onFocus={onFormItemFocus}
    //       />
    //     ))}
    //   </VView>
    // </ScrollView>
  );
};
