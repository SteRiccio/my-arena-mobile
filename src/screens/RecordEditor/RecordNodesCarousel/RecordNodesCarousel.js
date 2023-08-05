import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import PagerView from "react-native-pager-view";
import Dots from "react-native-dots-pagination";

import { NodeDefs } from "@openforis/arena-core";

import { DataEntryActions, DataEntrySelectors } from "state/dataEntry";

import { VView, View } from "components";

import { NodeDefFormItem } from "../NodeDefFormItem";
import { useStyles } from "./styles";

export const RecordNodesCarousel = () => {
  const dispatch = useDispatch();
  const { entityDef, entityUuid } = DataEntrySelectors.useCurrentPageEntity();

  if (__DEV__) {
    console.log(
      `rendering RecordNodesCarousel of ${NodeDefs.getName(entityDef)}`
    );
  }

  const pagerViewRef = useRef(null);
  const styles = useStyles();

  const childrenDefs =
    DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const activeChildIndex =
    DataEntrySelectors.useCurrentPageEntityActiveChildIndex();

  const onPageSelected = useCallback(
    (e) =>
      dispatch(
        DataEntryActions.selectCurrentPageEntityActiveChildIndex(
          e.nativeEvent.position
        )
      ),
    []
  );

  useEffect(() => {
    requestAnimationFrame(() =>
      pagerViewRef.current?.setPage(activeChildIndex)
    );
  }, [activeChildIndex, pagerViewRef]);

  return (
    <VView style={styles.container}>
      <PagerView
        offscreenPageLimit={2}
        onPageSelected={onPageSelected}
        ref={pagerViewRef}
        style={styles.pager}
        initialPage={activeChildIndex}
      >
        {childrenDefs.map((childDef) => (
          <View key={childDef.uuid} style={styles.childContainer}>
            <NodeDefFormItem nodeDef={childDef} parentNodeUuid={entityUuid} />
          </View>
        ))}
      </PagerView>
      <Dots length={childrenDefs.length} active={activeChildIndex} />
    </VView>
  );
};
