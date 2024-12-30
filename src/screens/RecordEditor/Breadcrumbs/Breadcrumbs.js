import React, { useCallback, useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";

import { DataEntrySelectors } from "../../../state/dataEntry/selectors";
import { HView } from "../../../components";
import { DataEntryActions } from "../../../state/dataEntry/actions";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { useBreadcrumbItems } from "./useBreadcrumbItems";

import styles from "./styles";

export const Breadcrumbs = () => {
  if (__DEV__) {
    console.log(`rendering Breadcrumbs`);
  }
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);

  const currentPageEntity = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef } = currentPageEntity;
  const entityDefUuid = entityDef.uuid;

  useEffect(() => {
    // scroll to the end (right) when selected entity changes
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }, [entityDefUuid]);

  const items = useBreadcrumbItems();

  const onItemPress = useCallback(
    (pageEntityItem) => {
      dispatch(DataEntryActions.selectCurrentPageEntity(pageEntityItem));
    },
    [dispatch]
  );

  return (
    <ScrollView
      contentContainerStyle={styles.externalContainerContent}
      horizontal
      ref={scrollViewRef}
      style={styles.externalContainer}
    >
      <HView style={styles.internalContainer} transparent>
        {items.map((item, index) => (
          <BreadcrumbItem
            key={item.entityDefUuid}
            isLastItem={index === items.length - 1}
            item={item}
            onItemPress={onItemPress}
          />
        ))}
      </HView>
    </ScrollView>
  );
};
