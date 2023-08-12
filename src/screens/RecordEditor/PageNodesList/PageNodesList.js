import { useMemo } from "react";
import { FlatList } from "react-native";
import { useDispatch } from "react-redux";
import { List, useTheme } from "react-native-paper";

import { NodeDefType, NodeDefs } from "@openforis/arena-core";

import { VView } from "components";
import { RecordPageNavigator } from "model";
import { DataEntryActions, DataEntrySelectors, SurveySelectors } from "state";
import { NodePageNavigationButton } from "../BottomNavigationBar/NodePageNavigationButton";

const iconByNodeDefType = {
  [NodeDefType.boolean]: () => "checkbox-marked-outline",
  [NodeDefType.code]: () => "format-list-numbered",
  [NodeDefType.coordinate]: () => "map-marker-outline",
  [NodeDefType.date]: () => "calendar-range",
  [NodeDefType.decimal]: () => "decimal",
  [NodeDefType.entity]: ({ nodeDef }) =>
    NodeDefs.isSingle(nodeDef) ? "window-maximize" : "table",
  [NodeDefType.file]: () => "file-outline",
  [NodeDefType.integer]: () => "numeric",
  [NodeDefType.taxon]: () => "tree-outline",
  [NodeDefType.text]: () => "format-text",
  [NodeDefType.time]: () => "clock-time-three-outline",
};

const getNodeDefIcon = (nodeDef) =>
  iconByNodeDefType[nodeDef.type]?.({ nodeDef });

export const PageNodesList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const childDefs = DataEntrySelectors.useCurrentPageEntityRelevantChildDefs();
  const lang = SurveySelectors.useCurrentSurveyPreferredLang();

  const currentEntityPointer = DataEntrySelectors.useCurrentPageEntity();
  const { entityDef, entityUuid } = currentEntityPointer;
  const activeChildIndex =
    DataEntrySelectors.useCurrentPageEntityActiveChildIndex();

  const survey = SurveySelectors.useCurrentSurvey();
  const record = DataEntrySelectors.useRecord();

  const prevEntityPointer = useMemo(
    () =>
      RecordPageNavigator.getPrevEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
    [survey, record, currentEntityPointer]
  );

  const nextEntityPointer = useMemo(
    () =>
      RecordPageNavigator.getNextEntityPointer({
        survey,
        record,
        currentEntityPointer,
      }),
    [survey, record, currentEntityPointer]
  );

  const activeChildTextStyle = { color: theme.colors.onPrimary };
  const activeChildItemStyle = {
    backgroundColor: theme.colors.primary,
  };
  const activeItemIconColor = theme.colors.onPrimary;

  return (
    <VView style={{ flex: 1, backgroundColor: "transparent" }}>
      {!NodeDefs.isRoot(entityDef) && prevEntityPointer && (
        <NodePageNavigationButton
          icon="chevron-left"
          entityPointer={prevEntityPointer}
        />
      )}
      {(NodeDefs.isSingleEntity(entityDef) || entityUuid) && (
        <FlatList
          scrollEnabled
          style={{ flex: 1 }}
          data={childDefs}
          renderItem={({ index, item }) => {
            const activeItem = index === activeChildIndex;
            return (
              <List.Item
                title={NodeDefs.getLabelOrName(item, lang)}
                onPress={() =>
                  dispatch(
                    DataEntryActions.selectCurrentPageEntityActiveChildIndex(
                      index
                    )
                  )
                }
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={activeItem ? activeItemIconColor : undefined}
                    icon={getNodeDefIcon(item)}
                  />
                )}
                style={activeItem ? activeChildItemStyle : undefined}
                titleStyle={activeItem ? activeChildTextStyle : undefined}
              />
            );
          }}
          keyExtractor={(item) => item.uuid}
        />
      )}
      {nextEntityPointer && (
        <NodePageNavigationButton
          icon="chevron-right"
          entityPointer={nextEntityPointer}
        />
      )}
    </VView>
  );
};
